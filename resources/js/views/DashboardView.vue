<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'home' })  // o router.push('/') si no tienes nombre 'home'
}
</script>

<template>
  <div class="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
    <h1 class="text-3xl font-bold mb-6">Bienvenido al Dashboard h1</h1>

    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-lg">Hola, <strong>{{ auth.userName }}</strong></p>
      <p class="text-gray-600 mt-2">Estás autenticado correctamente.</p>
      <p class="mt-4 text-sm text-gray-500">Token activo: {{ auth.token ? 'Sí' : 'No' }}</p>
    </div>

    <button 
      @click="handleLogout"
      class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
    >
      Cerrar sesión
    </button>
  </div>
</template>