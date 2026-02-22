// resources/js/app.js
import './bootstrap'        // ✅ solo axios aquí

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router/index.js'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useAuthStore } from './stores/auth.js'
import { i18n } from './i18n/index.js'
import 'animate.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  position: 'top-right',
  timeout: 8000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  icon: true,
})

// ✅ initAuth() llama a initEcho(token) internamente si hay token guardado
const authStore = useAuthStore()
authStore.initAuth()

// ✅ NO uses window.Echo aquí — puede no existir si el usuario no está logueado
// El canal admin se suscribe en App.vue cuando isAdmin === true
app.use(i18n) 
app.mount('#app')