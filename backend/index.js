const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// 🔥 endpoint productos
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error en la consulta')
    } else {
      res.json(result)
    }
  })
})

// prueba
app.get('/', (req, res) => {
  res.send('Backend funcionando 🔥')
})

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000')
})

app.post('/ventas', (req, res) => {
  const { cliente_id, empleado_id, total, detalle } = req.body

  db.query(
    'INSERT INTO ventas (cliente_id, empleado_id, total) VALUES (?, ?, ?)',
    [cliente_id, empleado_id, total],
    (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error al guardar venta')
      }

      const ventaId = result.insertId

      detalle.forEach(item => {
        db.query(
          `INSERT INTO detalle_ventas 
          (venta_id, producto_id, cantidad, precio_unitario, subtotal)
          VALUES (?, ?, ?, ?, ?)`,
          [ventaId, item.id, item.cantidad, item.precio, item.subtotal]
        )

        // 🔥 actualizar stock
        db.query(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [item.cantidad, item.id]
        )
      })

      res.json({ message: 'Venta guardada 🔥' })
    }
  )
})