require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })
}

const beginTransaction = () => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(err => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

const commitTransaction = () => {
  return new Promise((resolve, reject) => {
    db.commit(err => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

const rollbackTransaction = () => {
  return new Promise(resolve => {
    db.rollback(() => resolve())
  })
}

// rutas
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    res.json(result)
  })
})

app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, result) => {
    res.json(result)
  })
})

app.get('/empleados', (req, res) => {
  db.query('SELECT * FROM empleados', (err, result) => {
    res.json(result)
  })
})

app.post('/ventas', async (req, res) => {
  const clienteId = Number(req.body.clienteId ?? req.body.cliente_id)
  const empleadoId = Number(req.body.empleadoId ?? req.body.empleado_id)
  const estado = String(req.body.estado || 'completada')
  const items = req.body.items
  const estadosPermitidos = ['completada', 'pendiente', 'cancelada']

  if (!Number.isInteger(clienteId) || !Number.isInteger(empleadoId)) {
    return res.status(400).json({ message: 'Cliente y empleado son obligatorios' })
  }

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado de venta inválido' })
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'La venta debe incluir al menos un producto' })
  }

  const detalleNormalizado = items.map(item => ({
    productoId: Number(item.productoId ?? item.producto_id),
    cantidad: Number(item.cantidad)
  }))

  if (detalleNormalizado.some(item => !Number.isInteger(item.productoId) || item.productoId <= 0 || !Number.isInteger(item.cantidad) || item.cantidad <= 0)) {
    return res.status(400).json({ message: 'Los productos de la venta son inválidos' })
  }

  let enTransaccion = false

  try {
    const clienteExiste = await query('SELECT id FROM clientes WHERE id = ?', [clienteId])
    if (clienteExiste.length === 0) {
      return res.status(404).json({ message: 'El cliente no existe' })
    }

    const empleadoExiste = await query('SELECT id FROM empleados WHERE id = ?', [empleadoId])
    if (empleadoExiste.length === 0) {
      return res.status(404).json({ message: 'El empleado no existe' })
    }

    const idsProductos = [...new Set(detalleNormalizado.map(item => item.productoId))]
    const productosExistentes = await query('SELECT id, nombre, precio, stock FROM productos WHERE id IN (?)', [idsProductos])

    if (productosExistentes.length !== idsProductos.length) {
      return res.status(404).json({ message: 'Uno o más productos no existen' })
    }

    const productosPorId = new Map(productosExistentes.map(item => [Number(item.id), item]))

    const detalleConPrecios = detalleNormalizado.map(item => {
      const producto = productosPorId.get(item.productoId)
      const precioUnitario = Number(producto.precio)
      return {
        ...item,
        precioUnitario,
        subtotal: precioUnitario * item.cantidad,
        stock: Number(producto.stock)
      }
    })

    const sinStock = detalleConPrecios.find(item => item.cantidad > item.stock)
    if (sinStock) {
      return res.status(400).json({ message: `Stock insuficiente para producto ${sinStock.productoId}` })
    }

    const total = detalleConPrecios.reduce((sum, item) => sum + item.subtotal, 0)

    await beginTransaction()
    enTransaccion = true

    const ventaResult = await query(
      'INSERT INTO ventas (cliente_id, empleado_id, total, estado) VALUES (?, ?, ?, ?)',
      [clienteId, empleadoId, total, estado]
    )

    for (const item of detalleConPrecios) {
      await query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [ventaResult.insertId, item.productoId, item.cantidad, item.precioUnitario, item.subtotal]
      )

      await query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.productoId]
      )
    }

    await commitTransaction()

    res.status(201).json({
      message: 'Venta registrada correctamente',
      ventaId: ventaResult.insertId,
      total
    })
  } catch (error) {
    if (enTransaccion) {
      await rollbackTransaction()
    }

    console.error('Error guardando venta:', error)
    res.status(500).json({ message: 'Error guardando la venta en la base de datos' })
  }
})

// iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000 🔥')
})