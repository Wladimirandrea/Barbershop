<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-green-900 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-bold mb-6 text-center">
        Tu Dashboard
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-green-800 p-8 rounded-2xl shadow-xl">
          <h2 class="text-3xl font-semibold mb-4">Próxima Cita</h2>
          <p class="text-4xl font-bold">Sin citas</p>
          <p class="mt-4 text-green-200">Reserva tu próximo corte ahora</p>
        </div>

        <div class="bg-green-800 p-8 rounded-2xl shadow-xl">
          <h2 class="text-3xl font-semibold mb-4">Historial</h2>
          <p class="text-4xl font-bold">0</p>
          <p class="mt-4 text-green-200">Cortes realizados</p>
        </div>
      </div>

      <p class="mt-12 text-center text-green-200 text-xl">
        Hola {{ auth.userName }}, ¡prepárate para verte increíble!
      </p>
    </div>
  </div>
</template>