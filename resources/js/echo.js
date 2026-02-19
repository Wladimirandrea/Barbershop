import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export function initEcho(token) {
  if (window.Echo) return // evita doble inicialización

  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
    wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
    disableStats: true,
    authEndpoint: '/api/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })
}

export function destroyEcho() {
  if (window.Echo) {
    window.Echo.disconnect()
    window.Echo = null
  }
}