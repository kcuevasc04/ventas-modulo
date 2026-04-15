<template>
  <v-card class="pa-4 mb-4">
    <v-card-title style="color:#7F1D25">
      Registrar Venta
    </v-card-title>

    <v-row>
      <v-col cols="6">
        <v-select
          label="Cliente"
          :items="clientes"
          item-title="nombre"
          item-value="id"
          v-model="cliente"
        />
      </v-col>

      <v-col cols="6">
        <v-select
          label="Empleado"
          :items="empleados"
          item-title="nombre"
          item-value="id"
          v-model="empleado"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-select
          label="Producto"
          :items="productos"
          item-title="nombre"
          item-value="id"
          v-model="productoSeleccionado"
        />
      </v-col>

      <v-col cols="3">
        <v-text-field
          type="number"
          label="Cantidad"
          v-model="cantidad"
        />
      </v-col>

      <v-col cols="2">
        <v-btn color="#7F1D25" @click="agregarProducto">
          Agregar
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProductos, getClientes, getEmpleados } from '../../services/ventasApi.js'

// estados
const cliente = ref(null)
const empleado = ref(null)

const productos = ref([])
const clientes = ref([])
const empleados = ref([])

const productoSeleccionado = ref(null)
const cantidad = ref(1)

// 🔥 cargar TODO desde BD
onMounted(async () => {
  try {
    const resProd = await getProductos()
    productos.value = resProd.data

    const resClientes = await getClientes()
    clientes.value = resClientes.data

    const resEmpleados = await getEmpleados()
    empleados.value = resEmpleados.data

  } catch (error) {
    console.error('Error cargando datos:', error)
  }
})

// emitir al carrito
const emit = defineEmits(['agregar'])

const agregarProducto = () => {
  const prod = productos.value.find(p => p.id === productoSeleccionado.value)

  if (!prod) return

  emit('agregar', {
    id: prod.id,
    nombre: prod.nombre,
    precio: parseFloat(prod.precio),
    cantidad: cantidad.value,
    subtotal: parseFloat(prod.precio) * cantidad.value
  })
}
</script>