require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

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

// iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000 🔥')
})