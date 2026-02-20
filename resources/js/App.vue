<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { Howl, Howler } from 'howler'
import Navbar from '@/components/Navbar.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useNotificationsStore } from '@/stores/notifications'

const auth = useAuthStore()
const toast = useToast()
const notifications = useNotificationsStore()

let adminChannel = null
let notificationSound = null

const initSound = () => {
  if (!notificationSound) {
    notificationSound = new Howl({
      src: ['/sounds/notification.mp3'],
      volume: 1.0,
      preload: true,
      html5: false,  // ✅ cambia a false para usar WebAudio en lugar de HTML5
      onload: () => console.log('✅ Sonido cargado'),
      onloaderror: (id, err) => console.error('❌ Error cargando sonido:', err),
    })
  }
}

const subscribeAdminChannel = () => {
  if (!window.Echo) {
    console.warn('⚠️ Echo no listo, reintentando en 1s...')
    setTimeout(subscribeAdminChannel, 1000) // ✅ reintenta hasta que Echo esté listo
    return
  }

  if (adminChannel) return // ya suscrito, no duplicar

  adminChannel = window.Echo.private('admin.notifications')
    .listen('.user.registered', (event) => {
      console.log('✅ Nuevo registro:', event)

      // ✅ agrega al dropdown
      notifications.addUser({
        id: event.id,
        name: event.name,
        email: event.email,
        time: event.time,
      })

      // ✅ toast
      toast.success(`🧑 Nuevo usuario: ${event.name} (${event.email})`, {
        position: 'top-right',
        timeout: 8000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      // ✅ sonido
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

    <div class="flex flex-1">
      <AdminSidebar v-if="auth.isAdmin" />

      <main class="flex-grow flex flex-col min-h-0">
        <router-view />
      </main>
    </div>
  </div>
</template>