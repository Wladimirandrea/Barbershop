// resources/js/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'   // ← CORREGIDO con alias @

// Lazy loading de vistas
const RegisterView   = () => import('@/views/auth/RegisterView.vue')
const LoginView      = () => import('@/views/auth/LoginView.vue')
const DashboardView  = () => import('@/views/DashboardView.vue')
const HomeView       = () => import('@/views/HomeView.vue')

const routes = [
  { path: '/',           name: 'home',      component: HomeView },
  { 
    path: '/register', 
    name: 'register', 
    component: RegisterView,
    meta: { guestOnly: true }
  },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    meta: { guestOnly: true }
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  // Ruta 404 (opcional pero útil)
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: { template: '<div class="text-center mt-20"><h1>404 - Página no encontrada</h1></div>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware global
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Si la ruta requiere auth y no estás logueado → redirige a login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' })
  }

  // Si la ruta es solo para invitados y ya estás logueado → redirige a dashboard
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router