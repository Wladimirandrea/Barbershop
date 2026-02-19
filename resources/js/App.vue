<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { Howl, Howler } from 'howler'
import Navbar from '@/components/Navbar.vue'

const auth = useAuthStore()
const toast = useToast()

let adminChannel = null
let notificationSound = null

const initSound = () => {
  if (!notificationSound) {
    notificationSound = new Howl({
      src: ['/sounds/notification.mp3'],
      volume: 1.0,
      preload: true,
      html5: true,  // ✅ esto soluciona el problema de 48kHz y AudioContext
      onload: () => console.log('✅ Sonido cargado'),
      onloaderror: (id, err) => console.error('❌ Error cargando sonido:', err),
    })
  }
}


const subscribeAdminChannel = () => {
  if (!window.Echo) {
    console.warn('⚠️ Echo no está inicializado aún')
    return
  }

  if (adminChannel) return // ya suscrito, no duplicar

  adminChannel = window.Echo.private('admin.notifications')
    .listen('.user.registered', (event) => {
      console.log('✅ Nuevo registro:', event)

      toast.success(`🧑 Nuevo usuario: ${event.name} (${event.email})`, {
        position: 'top-right',
        timeout: 8000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      notificationSound?.play()
    })
    .error((error) => {
      console.error('❌ Error en canal admin.notifications:', error)
    })
}

const unsubscribeAdminChannel = () => {
  if (adminChannel && window.Echo) {
    window.Echo.leave('admin.notifications')
    adminChannel = null
  }
}

// ✅ watch fuera de onMounted — reacciona a cambios de auth en tiempo real
watch(
  () => auth.isAuthenticated && auth.isAdmin,
  (isAdminAndAuth) => {
    if (isAdminAndAuth) {
      subscribeAdminChannel()
    } else {
      unsubscribeAdminChannel()
    }
  },
  { immediate: true }
)

onMounted(() => {
  initSound()
  const unlock = () => {
    Howler.ctx?.resume()
    document.removeEventListener('click', unlock)
  }
  document.addEventListener('click', unlock, { once: true })

})

onUnmounted(() => {
  unsubscribeAdminChannel()
  notificationSound?.unload()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar v-if="auth.isAuthenticated" />

    <main class="flex-grow">
      <router-view />
    </main>
  </div>
</template>