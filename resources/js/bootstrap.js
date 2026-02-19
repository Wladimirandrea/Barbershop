// resources/js/bootstrap.js

import axios from 'axios'

// Asignar axios globalmente (útil si lo usas en window.axios en algún lugar)
window.axios = axios

// Configuración global recomendada
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Accept'] = 'application/json'

// Prefijo automático para TODAS las peticiones API (muy útil y evita duplicados)
window.axios.defaults.baseURL = '/api'  // ← todas las llamadas se convierten en /api/xxxx

// Interceptor para manejar errores comunes (401 → logout automático)
window.axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o no autorizado → logout
      const auth = window.useAuthStore?.()  // si Pinia ya está disponible
      if (auth) {
        auth.logout()
        window.location.href = '/login'  // redirigir a login
      }
    }
    // Puedes agregar más manejo (ej: 403, 422, etc.)
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
  // Opcional: más debug
  disableStats: false,
})