<template>
  <v-card class="pa-4 mb-4">
    <v-card-title style="color:#7F1D25">
      Registrar Venta
    </v-card-title>

    <v-alert
      v-if="errorCarga"
      type="error"
      variant="tonal"
      class="mb-4"
      density="comfortable"
    >
      {{ errorCarga }}
      <div class="mt-2">
        <v-btn size="small" variant="outlined" @click="cargarCatalogos">
          Reintentar
        </v-btn>
      </div>
    </v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Cliente"
          v-model="clienteId"
          :items="clientes"
          item-title="label"
          item-value="id"
          placeholder="Busca por nombre o apellido"
          :loading="cargando"
          :disabled="cargando || !!errorCarga"
          no-data-text="No hay clientes disponibles"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-autocomplete
          label="Empleado"
          v-model="empleadoId"
          :items="empleados"
          item-title="label"
          item-value="id"
          placeholder="Busca por nombre o apellido"
          :loading="cargando"
          :disabled="cargando || !!errorCarga"
          no-data-text="No hay empleados disponibles"
          clearable
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          label="Estado"
          v-model="estado"
          :items="estadosVenta"
          item-title="label"
          item-value="value"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-autocomplete
          label="Producto"
          v-model="productoId"
          :items="productos"
          item-title="label"
          item-value="id"
          placeholder="Busca por nombre"
          :loading="cargando"
          :disabled="cargando || !!errorCarga"
          no-data-text="No hay productos disponibles"
          clearable
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
          label="Stock"
          :model-value="productoSeleccionado ? productoSeleccionado.stock : '-'"
          readonly
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
          label="Precio"
          :model-value="productoSeleccionado ? Number(productoSeleccionado.precio).toFixed(2) : '-'"
          readonly
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
          type="number"
          label="Cantidad"
          min="1"
          step="1"
          v-model="cantidad"
        />
      </v-col>

      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn color="#7F1D25" @click="agregarProducto">
          Agregar
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getClientes, getEmpleados, getProductos } from '../../services/ventasApi.js'

const clienteId = ref(null)
const empleadoId = ref(null)
const estado = ref('completada')
const productoId = ref(null)
const cantidad = ref(1)

const clientes = ref([])
const empleados = ref([])
const productos = ref([])
const cargando = ref(false)
const errorCarga = ref('')

const estadosVenta = [
  { label: 'Completada', value: 'completada' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Cancelada', value: 'cancelada' }
]

const productoSeleccionado = computed(() => {
  return productos.value.find(item => Number(item.id) === Number(productoId.value)) || null
})

const cargarCatalogos = async () => {
  cargando.value = true
  errorCarga.value = ''

  try {
    const [resClientes, resEmpleados, resProductos] = await Promise.all([
      getClientes(),
      getEmpleados(),
      getProductos()
    ])

    clientes.value = resClientes.data.map(item => ({
      ...item,
      label: `${item.nombre} ${item.apellido}`
    }))

    empleados.value = resEmpleados.data.map(item => ({
      ...item,
      label: `${item.nombre} ${item.apellido}`
    }))

    productos.value = resProductos.data.map(item => ({
      ...item,
      label: `${item.nombre} (Stock: ${item.stock})`
    }))
  } catch (error) {
    console.error('No se pudieron cargar los datos del formulario:', error)
    const status = error?.response?.status
    const detail = error?.response?.data?.detail || error?.response?.data?.message || error?.message
    errorCarga.value = `No se pudo cargar la API de ventas${status ? ` (HTTP ${status})` : ''}. ${detail || 'Verifica backend y variables de entorno de la BD.'}`
  } finally {
    cargando.value = false
  }
}

onMounted(cargarCatalogos)

const emit = defineEmits(['agregar'])

const agregarProducto = () => {
  const clienteValue = Number(clienteId.value)
  const empleadoValue = Number(empleadoId.value)
  const productoValue = Number(productoId.value)
  const cantidadIngresada = Number(cantidad.value)

  if (!Number.isInteger(clienteValue) || clienteValue <= 0) {
    return
  }

  if (!Number.isInteger(empleadoValue) || empleadoValue <= 0) {
    return
  }

  if (!estado.value) {
    return
  }

  if (!Number.isInteger(productoValue) || productoValue <= 0) {
    return
  }

  if (!Number.isInteger(cantidadIngresada) || cantidadIngresada <= 0) {
    return
  }

  const producto = productos.value.find(item => Number(item.id) === productoValue)

  if (!producto) {
    return
  }

  if (cantidadIngresada > Number(producto.stock)) {
    return
  }

  const precioUnitario = Number(producto.precio)

  emit('agregar', {
    clienteId: clienteValue,
    empleadoId: empleadoValue,
    estado: estado.value,
    item: {
      productoId: productoValue,
      nombre: producto.nombre,
      precioUnitario,
      cantidad: cantidadIngresada,
      subtotal: precioUnitario * cantidadIngresada
    }
  })

  productoId.value = null
  cantidad.value = 1
}
</script>
