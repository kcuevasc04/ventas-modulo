const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'bz1k2riqdiarqfaa6de9-mysql.services.clever-cloud.com',
  user: 'u7mhnlkxtge3ehkz',
  password: 'YmhHFtkNAw1IlkZNUAd0',
  database: 'bz1k2riqdiarqfaa6de9'
})

db.connect(err => {
  if (err) {
    console.error('Error conexión:', err)
  } else {
    console.log('Conectado a MySQL 🔥')
  }
})

module.exports = db