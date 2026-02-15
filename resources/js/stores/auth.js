// resources/js/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Invitado',
    userEmail: (state) => state.user?.email || '',
    userRoles: (state) => state.user?.roles || [],
  },

  actions: {
    initAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch (e) {
          console.error('Error al parsear usuario de localStorage:', e)
          this.logout()
        }
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post('/register', userData)  // ← CORREGIDO (sin /api)

        const { token, user } = response.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al registrar usuario'
        console.error('Error en register:', error)
        throw error.response?.data || error.message
      } finally {
        this.isLoading = false
      }
    },

    async login(credentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post('/login', credentials)  // ← CORREGIDO (sin /api)

        const { token, user } = response.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Credenciales inválidas o error en el servidor'
        console.error('Error en login:', error)
        throw error.response?.data || error.message
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      delete axios.defaults.headers.common['Authorization']
    },

    async updateUser() {
      try {
        const response = await axios.get('/profile')  // ← sin /api (baseURL lo agrega)
        this.user = response.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        console.error('Error al actualizar usuario:', err)
      }
    }
  }
})