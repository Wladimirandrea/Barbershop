<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const notificationCount = ref(4)              // notificaciones generales
const newUserNotifications = ref(3)           // contador de nuevos usuarios (tu badge rojo para 👤)
const profileDropdownOpen = ref(false)
const languageDropdownOpen = ref(false)
</script>

<template>
  <header class="bg-gray-950 border-b border-gray-800">
    <div class="max-w-screen-2xl mx-auto px-4 lg:px-8">
      <div class="flex h-14 items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <span class="text-lg font-semibold text-white">BarberShop</span>
        </div>

        <!-- Búsqueda centrada -->
        <div class="hidden md:flex flex-1 max-w-xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              class="w-full h-9 pl-10 pr-4 text-sm bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition"
            >
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
              🔍
            </div>
          </div>
        </div>

        <!-- Acciones derecha -->
        <div class="flex items-center gap-4 lg:gap-6">
          <!-- Notificaciones generales -->
          <button class="relative p-2 text-gray-400 hover:text-gray-200 focus:outline-none transition">
            <span class="text-xl">🔔</span>
            <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full px-1.5">
              {{ notificationCount }}
            </span>
          </button>

          <!-- Nuevos usuarios / registros pendientes (tu icono 👤 con badge rojo) -->
          <button class="relative p-2 text-gray-400 hover:text-gray-200 focus:outline-none transition">
            <span class="text-xl">👤</span>
            <span v-if="newUserNotifications > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full px-1.5">
              {{ newUserNotifications }}
            </span>
          </button>

          <!-- Idioma -->
          <div class="relative">
            <button 
              @click="languageDropdownOpen = !languageDropdownOpen"
              class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
            >
              <span class="text-xl">🇺🇸</span>
              <span class="text-sm text-gray-300">EN</span>
              <span class="text-gray-500 text-xs">▼</span>
            </button>

            <div 
              v-if="languageDropdownOpen"
              @click.outside="languageDropdownOpen = false"
              class="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-2 z-50 text-sm"
            >
              <button class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 transition">
                English (EN) 🇺🇸
              </button>
              <button class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 transition">
                Español (ES) 🇪🇸
              </button>
            </div>
          </div>

          <!-- Avatar real del usuario logueado -->
          <div class="relative">
            <button 
              @click="profileDropdownOpen = !profileDropdownOpen"
              class="flex items-center gap-3 focus:outline-none group"
            >
              <div class="relative">
                <img 
                  :src="auth.user?.avatar ? `/storage/${auth.user.avatar}` : '/storage/avatars/default.png'" 
                  alt="Avatar del usuario" 
                  class="w-8 h-8 rounded-full object-cover border border-gray-600 shadow-sm"
                >
                <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-gray-950 shadow"></span>
              </div>

              <div class="hidden md:flex flex-col items-start">
                <span class="text-sm font-medium text-white group-hover:text-gray-200 transition">
                  {{ auth.userName || 'Usuario' }}
                </span>
                <span class="text-xs text-gray-500 capitalize">
                  {{ auth.userRoles[0]?.name || 'Invitado' }}
                </span>
              </div>

              <span class="text-gray-500 group-hover:text-gray-300 transition text-xs">▼</span>
            </button>

            <!-- Dropdown de perfil -->
            <div 
              v-if="profileDropdownOpen"
              @click.outside="profileDropdownOpen = false"
              class="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-1.5 z-50 text-sm"
            >
              <div class="px-4 py-2 border-b border-gray-800">
                <p class="font-medium text-white">{{ auth.userName }}</p>
                <p class="text-xs text-gray-500">{{ auth.userEmail }}</p>
              </div>

              <router-link 
                to="/profile"
                class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                Mi Perfil
              </router-link>

              <router-link 
                to="/settings"
                class="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                Configuración
              </router-link>

              <hr class="my-1 border-gray-800" />

              <button 
                @click="auth.logout()"
                class="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>