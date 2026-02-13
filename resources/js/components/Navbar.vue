<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'home' })  // o router.push('/')
}

// Colores y enlaces según rol
const navbarConfig = {
  admin: {
    bg: 'bg-gray-900',
    text: 'text-white',
    links: [
      { label: 'Usuarios', to: '/admin/users' },
      { label: 'Reportes', to: '/admin/reports' },
    ]
  },
  barber: {
    bg: 'bg-teal-700',
    text: 'text-white',
    links: [
      { label: 'Horarios', to: '/barber/schedule' },
      { label: 'Clientes', to: '/barber/clients' },
    ]
  },
  client: {
    bg: 'bg-green-800',
    text: 'text-white',
    links: [
      { label: 'Mis Citas', to: '/client/appointments' },
      { label: 'Reservar', to: '/client/book' },
    ]
  }
}

// Obtener config según rol principal
const role = auth.user?.roles?.[0]?.name || 'client'
const config = navbarConfig[role] || navbarConfig.client
</script>

<template>
  <nav :class="`${config.bg} shadow-lg`">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo / Título -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold" :class="config.text">
            BarberShop
          </router-link>
        </div>

        <!-- Enlaces según rol -->
        <div class="hidden md:flex space-x-8">
          <router-link
            v-for="link in config.links"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-20 hover:bg-white transition"
            :class="config.text"
          >
            {{ link.label }}
          </router-link>
        </div>

        <!-- Usuario y Logout -->
        <div class="flex items-center space-x-4">
          <span :class="config.text" class="text-sm font-medium">
            Hola, {{ auth.userName }}
          </span>

          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>