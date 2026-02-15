// resources/js/bootstrap.js

import axios from 'axios'

// Asignar axios globalmente (si lo necesitas en window)
window.axios = axios

// Configuración global recomendada
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Accept'] = 'application/json'

// Prefijo automático para todas las peticiones API (muy útil)
window.axios.defaults.baseURL = '/api'

// Interceptor para manejar errores comunes (401 → logout automático)
window.axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o no autorizado → logout
      const auth = window.useAuthStore?.() // si ya tienes Pinia disponible
      if (auth) {
        auth.logout()
        window.location.href = '/login' // o usa router si está disponible
      }
    }
    return Promise.reject(error)
  }
)

// Configuración de Laravel Echo + Reverb
import Echo from 'laravel-echo'

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    // Opcional: debug
    disableStats: false,
})