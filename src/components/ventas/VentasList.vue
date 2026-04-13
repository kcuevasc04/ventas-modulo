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
          <td>{{ item.precio }}</td>
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

    <v-btn color="#9F6162" @click="guardarVenta">
      Guardar Venta
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

// recibir carrito
const props = defineProps(['carrito'])
const emit = defineEmits(['eliminar'])

const eliminar = (index) => {
  emit('eliminar', index)
}

const total = computed(() =>
  props.carrito.reduce((sum, item) => sum + item.subtotal, 0)
)

const guardarVenta = () => {
  alert('Venta guardada (simulada)')
}
</script>