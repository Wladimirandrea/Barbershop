<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'  // ya lo tienes

const auth = useAuthStore()

onMounted(() => {
  // Canal público (test) - siempre activo
  window.Echo.channel('test')
    .listen('TestEvent', (event) => {
      console.log('Evento recibido en canal público:', event)
      // Opcional: mostrar notificación global o guardar en store
      // auth.addNotification?.(event.message)
    })
    .error((error) => {
      console.error('Error en canal público test:', error)
    })

  // Canal privado solo si está autenticado
  if (auth.isAuthenticated && auth.user?.id) {
    window.Echo.private(`user.${auth.user.id}`)
      .listen('SomePrivateEvent', (e) => {
        console.log('Evento privado recibido para usuario:', e)
        // Aquí puedes mostrar notificación personalizada
      })
      .error((error) => {
        console.error('Error en canal privado:', error)
      })
  }
})

onUnmounted(() => {
  // Limpieza obligatoria de canales
  window.Echo.leave('test')
  if (auth.isAuthenticated && auth.user?.id) {
    window.Echo.leave(`user.${auth.user.id}`)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar solo visible si está autenticado -->
    <Navbar v-if="auth.isAuthenticated" />

    <!-- Contenido principal de la ruta -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Opcional: footer o mensaje de Reverb solo en desarrollo -->
    <!-- <footer v-if="!auth.isAuthenticated" class="fixed bottom-0 left-0 right-0 p-4 bg-blue-600 text-white text-center">
      Reverb conectado 🎉 - Prueba eventos en consola
    </footer> -->
  </div>
</template>