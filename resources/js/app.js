import './echo'
import './bootstrap'
import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App)

app.mount('#app')



window.Echo.channel('test-channel')
    .listen('test.notification', (event) => {
        console.log('¡Evento capturado globalmente! 🎉', event);
        // Opcional: agrega a un ref si usas Pinia/Vuex o muestra toast
    });