<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    await auth.login(form.value)
    alert('¡Inicio de sesión exitoso! Redirigiendo...')
    router.push({ name: 'dashboard' })
  } catch (err) {
    console.error(err)
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      error.value = Object.values(errors).flat().join('\n')
    } else {
      error.value = err.message || 'Error al iniciar sesión. Intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
      {{ error }}
    </div>

    <form @submit.prevent="login" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
          autocomplete="email"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input 
          v-model="form.password" 
          type="password" 
          required 
          autocomplete="current-password"
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      ¿No tienes cuenta? 
      <router-link to="/register" class="text-blue-600 hover:underline">Regístrate aquí</router-link>
    </p>
  </div>
</template>