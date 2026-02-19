<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'  // ✅

const auth = useAuthStore()
const { t } = useI18n()  // ✅
const notificaciones = ref([])

if (window.Echo) {
  window.Echo.private('admin.notifications')
    .listen('.user.registered', (event) => {
      notificaciones.value.unshift(event)
    })
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-bold mb-6 text-center text-gray-100">
        {{ t('dashboard.title') }}
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">{{ t('dashboard.total_users') }}</h2>
          <p class="text-4xl font-bold">0</p>
        </div>
        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">{{ t('dashboard.appointments_today') }}</h2>
          <p class="text-4xl font-bold">0</p>
        </div>
        <div class="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-4">{{ t('dashboard.monthly_revenue') }}</h2>
          <p class="text-4xl font-bold">$0</p>
        </div>
      </div>

      <div v-if="notificaciones.length" class="mt-10">
        <h2 class="text-2xl font-semibold mb-4">{{ t('dashboard.new_registrations') }}</h2>
        <div
          v-for="(n, i) in notificaciones"
          :key="i"
          class="bg-gray-800 rounded-lg p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p class="font-bold">{{ n.name }}</p>
            <p class="text-gray-400 text-sm">{{ n.email }}</p>
          </div>
          <span class="text-gray-500 text-sm">{{ n.time }}</span>
        </div>
      </div>

      <p class="mt-12 text-center text-gray-400">
        {{ t('dashboard.welcome', { name: auth.userName }) }}
      </p>
    </div>
  </div>
</template>