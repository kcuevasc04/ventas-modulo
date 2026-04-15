import axios from 'axios'

const API = 'http://localhost:3000'

export const getProductos = () => {
  return axios.get(`${API}/productos`)
}

export const getClientes = () => {
  return axios.get(`${API}/clientes`)
}

export const getEmpleados = () => {
  return axios.get(`${API}/empleados`)
}

export const guardarVenta = (data) => {
  return axios.post(`${API}/ventas`, data)
}