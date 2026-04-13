<template>
  <v-container>
    <h1 style="color:#7F1D25">Ventas</h1>

    <VentaForm @agregar="agregarAlCarrito" />

    <VentasList :carrito="carrito" @eliminar="eliminarDelCarrito" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import VentaForm from '../components/ventas/VentaForm.vue'
import VentasList from '../components/ventas/VentasList.vue'

// 🛒 carrito global
const carrito = ref([])

// ➕ agregar producto
const agregarAlCarrito = (producto) => {
  carrito.value.push(producto)
}

// ❌ eliminar producto
const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}
</script>