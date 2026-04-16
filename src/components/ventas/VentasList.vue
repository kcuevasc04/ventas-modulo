<template>
  <v-card class="pa-4">
    <v-card-title style="color:#7F1D25">
      Carrito de Venta
    </v-card-title>

    <v-table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in carrito" :key="index">
          <td>{{ item.nombre }}</td>
          <td>{{ item.precioUnitario }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ item.subtotal }}</td>
          <td>
            <v-btn color="#63131C" @click="eliminar(index)">
              X
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <h2 style="color:#7F1D25">Total: {{ total }}</h2>

    <v-btn color="#9F6162" :disabled="!puedeGuardar" :loading="guardando" @click="guardarVenta">
      Guardar Venta
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { guardarVenta as guardarVentaApi } from '../../services/ventasApi.js'

// recibir carrito
const props = defineProps(['carrito', 'clienteId', 'empleadoId', 'estado'])
const emit = defineEmits(['eliminar', 'guardada'])

const guardando = ref(false)

const eliminar = (index) => {
  emit('eliminar', index)
}

const total = computed(() =>
  props.carrito.reduce((sum, item) => sum + item.subtotal, 0)
)

const puedeGuardar = computed(() => {
  return props.carrito.length > 0 && Number.isInteger(props.clienteId) && Number.isInteger(props.empleadoId) && !!props.estado
})

const guardarVenta = async () => {
  if (!puedeGuardar.value || guardando.value) return

  guardando.value = true

  try {
    await guardarVentaApi({
      clienteId: props.clienteId,
      empleadoId: props.empleadoId,
      estado: props.estado,
      items: props.carrito.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      }))
    })

    alert('Venta guardada en la base de datos')
    emit('guardada')
  } catch (error) {
    const message = error?.response?.data?.message || 'No se pudo guardar la venta'
    alert(message)
  } finally {
    guardando.value = false
  }
}
</script>