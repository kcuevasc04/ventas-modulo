import axios from 'axios'

const API = 'http://localhost:3000'

export const guardarVenta = (data) => {
  return axios.post(`${API}/ventas`, data)
}