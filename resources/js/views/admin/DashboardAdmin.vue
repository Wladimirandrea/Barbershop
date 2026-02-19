<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-bold mb-6 text-center text-gray-100">
        Dashboard Administrador
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">Usuarios Totales</h2>
          <p class="text-4xl font-bold">0</p> <!-- Aquí iría un conteo real -->
        </div>

        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">Turnos Hoy</h2>
          <p class="text-4xl font-bold">0</p>
        </div>

        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">Ingresos Mensuales</h2>
          <p class="text-4xl font-bold">$0</p>
        </div>
      </div>

      <p class="mt-12 text-center text-gray-400">
        Bienvenido, {{ auth.userName }}. Tienes control total del sistema.
      </p>
    </div>
  </div>
</template>