<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const register = async () => {
  error.value = ''
  loading.value = true

  try {
    await auth.register(form.value)
    alert('¡Registro exitoso! Redirigiendo...')
    router.push({ name: 'dashboard' })
  } catch (err) {
    console.error(err)
    if (err.response?.data?.errors) {
      // Errores de validación de Laravel
      const errors = err.response.data.errors
      error.value = Object.values(errors).flat().join('\n')
    } else {
      error.value = err.message || 'Error al registrar. Intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
    <h2 class="text-2xl font-bold text-center mb-6">Crear cuenta</h2>

    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
      {{ error }}
    </div>

    <form @submit.prevent="register" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input 
          v-model="form.name" 
          type="text" 
          required 
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input 
          v-model="form.email" 
          type="email" 
          required 
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
          class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      ¿Ya tienes cuenta? 
      <router-link to="/login" class="text-blue-600 hover:underline">Inicia sesión</router-link>
    </p>
  </div>
</template>