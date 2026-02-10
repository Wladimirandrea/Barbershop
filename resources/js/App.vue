<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.Echo.channel('test').listen('TestEvent', (e) => {
    console.log('Evento recibido:', e)
  })
})
</script>

<template>
  <h1>Reverb funcionando 🎉</h1>
</template>
