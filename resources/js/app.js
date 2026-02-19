// resources/js/app.js

// Importaciones base
import './echo'          // Reverb + Echo
import './bootstrap'     // Axios, helpers, etc. (si lo tienes)

// Vue y plugins
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Componente raíz y router
import App from './App.vue'
import router from './router/index.js'   // Asegúrate de que esta ruta sea correcta

// Crear Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Crear la app
const app = createApp(App)

// Registrar plugins
app.use(pinia)
app.use(router)

// Cargar autenticación inmediatamente después de usar Pinia
import { useAuthStore } from './stores/auth.js'   // ← ruta relativa correcta desde app.js
const authStore = useAuthStore()
authStore.initAuth()   // Carga token y user desde localStorage

// Escucha global de Echo (opcional - puedes moverla a un composable más adelante)
window.Echo.channel('test-channel')
    .listen('test.notification', (event) => {
        console.log('Evento global recibido:', event)
        // Opcional: usar el store para mostrar notificaciones
        // authStore.addNotification?.(event.message)
    })
    .error((error) => {
        console.error('Error en canal test-channel:', error)
    })

// Montar la aplicación
app.mount('#app')