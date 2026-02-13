<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'  // ← nuevo import

const auth = useAuthStore()

onMounted(() => {
  const channel = window.Echo.channel('test')
    .listen('TestEvent', (event) => {
      console.log('Evento recibido:', event)
    })
    .error((error) => {
      console.error('Error en canal:', error)
    })

  if (auth.isAuthenticated && auth.user?.id) {
    window.Echo.private(`user.${auth.user.id}`)
      .listen('SomePrivateEvent', (e) => {
        console.log('Evento privado:', e)
      })
  }
})

onUnmounted(() => {
  window.Echo.leave('test')
  if (auth.isAuthenticated && auth.user?.id) {
    window.Echo.leave(`user.${auth.user.id}`)
  }
})
</script>

<template>
  <!-- Navbar solo si está autenticado -->
  <Navbar v-if="auth.isAuthenticated" />

  <!-- Contenido de la ruta -->
  <router-view />

  <!-- Opcional: mensaje de Reverb solo en desarrollo o en home -->
  <!-- <div v-if="!auth.isAuthenticated" class="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded shadow-lg z-50">
    Reverb conectado 🎉
  </div> -->
</template>