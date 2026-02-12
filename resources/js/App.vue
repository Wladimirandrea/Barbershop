<script setup>
import { onMounted, onUnmounted } from 'vue'

// Opcional: importamos el store si ya lo tienes (para manejar notificaciones globales)
import { useAuthStore } from '@/stores/auth' // ajusta la ruta si es necesario

const auth = useAuthStore()

onMounted(() => {
  // Escuchamos un canal público (test)
  const channel = window.Echo.channel('test')
    .listen('TestEvent', (event) => {
      console.log('Evento recibido en canal público:', event)
      
      // Ejemplo: mostrar toast o guardar en store
      // alert(event.message || 'Evento TestEvent recibido!')
      // auth.addNotification?.(event)  ← si tienes un método en el store
    })
    .error((error) => {
      console.error('Error en canal test:', error)
    })

  // Opcional: escuchar canal privado del usuario autenticado
  if (auth.isAuthenticated) {
    window.Echo.private(`user.${auth.user?.id}`)
      .listen('SomePrivateEvent', (e) => {
        console.log('Evento privado recibido:', e)
      })
  }
})

onUnmounted(() => {
  // Limpieza importante: dejar el canal al desmontar
  window.Echo.leave('test')
  // Si agregaste canales privados: window.Echo.leave(`user.${auth.user?.id}`)
})
</script>

<template>

  <div>
    <router-view></router-view>
  </div>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Reverb funcionando 🎉
      </h1>
      
      <p class="text-lg text-gray-600 mb-8">
        Escuchando en canal público <strong>test</strong> → evento <strong>TestEvent</strong>
      </p>

      <!-- Espacio para mostrar notificaciones o estado -->
      <div class="mt-8 p-4 bg-white rounded-lg shadow max-w-md w-full">
        <p class="text-gray-500">Abre la consola del navegador (F12) para ver los eventos en tiempo real.</p>
      </div>
    </div>
  </div>
</template>