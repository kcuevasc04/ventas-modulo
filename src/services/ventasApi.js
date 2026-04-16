import axios from 'axios'

const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const apiClient = axios.create({
  baseURL: API
})

export const getProductos = () => {
  return apiClient.get('/productos')
}

export const getClientes = () => {
  return apiClient.get('/clientes')
}

export const getEmpleados = () => {
  return apiClient.get('/empleados')
}

export const guardarVenta = (data) => {
  return apiClient.post('/ventas', data)
}