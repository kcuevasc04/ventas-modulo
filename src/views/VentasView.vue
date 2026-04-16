<template>
  <v-container>
    <h1 style="color:#7F1D25">Ventas</h1>

    <VentaForm @agregar="agregarAlCarrito" />

    <VentasList
      :carrito="carrito"
      :cliente-id="clienteId"
      :empleado-id="empleadoId"
      :estado="estado"
      @eliminar="eliminarDelCarrito"
      @guardada="limpiarVenta"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import VentaForm from '../components/ventas/VentaForm.vue'
import VentasList from '../components/ventas/VentasList.vue'

// 🛒 carrito global
const carrito = ref([])
const clienteId = ref(null)
const empleadoId = ref(null)
const estado = ref('completada')

// ➕ agregar producto
const agregarAlCarrito = ({ clienteId: cliente, empleadoId: empleado, estado: estadoVenta, item }) => {
  clienteId.value = cliente
  empleadoId.value = empleado
  estado.value = estadoVenta
  carrito.value.push(item)
}

// ❌ eliminar producto
const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const limpiarVenta = () => {
  carrito.value = []
  clienteId.value = null
  empleadoId.value = null
  estado.value = 'completada'
}
</script>