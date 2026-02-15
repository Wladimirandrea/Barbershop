<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  role: 'client',
})
const editId = ref(null)
const loading = ref(false)
const error = ref('')

const fetchUsers = async () => {
  try {
    const res = await axios.get('/admin/users')
    users.value = res.data
  } catch (err) {
    error.value = 'Error al cargar usuarios'
  }
}

const saveUser = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = { ...form.value }
    if (!data.password) delete data.password

    if (editId.value) {
      await axios.put(`/admin/users/${editId.value}`, data)
    } else {
      await axios.post('/admin/users', data)
    }

    // Limpiar formulario
    Object.assign(form.value, {
      name: '', email: '', password: '', password_confirmation: '', phone: '', role: 'client'
    })
    editId.value = null

    fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar'
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  editId.value = user.id
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    phone: user.phone || '',
    role: user.roles[0]?.name || 'client',
  }
}

const deleteUser = async (id) => {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return

  try {
    await axios.delete(`/admin/users/${id}`)
    fetchUsers()
  } catch (err) {
    alert('Error al eliminar')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Gestión de Usuarios (Admin)</h1>

    <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>

    <!-- Formulario de creación/edición -->
    <div class="bg-white p-6 rounded-lg shadow mb-10">
      <h2 class="text-xl font-semibold mb-4">{{ editId ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h2>
      
      <form @submit.prevent="saveUser" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input v-model="form.name" type="text" required class="w-full p-3 border rounded">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="form.email" type="email" required class="w-full p-3 border rounded">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Contraseña {{ editId ? '(dejar vacío para no cambiar)' : '' }}</label>
          <input v-model="form.password" type="password" :required="!editId" class="w-full p-3 border rounded">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Confirmar Contraseña</label>
          <input v-model="form.password_confirmation" type="password" :required="!editId" class="w-full p-3 border rounded">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Teléfono</label>
          <input v-model="form.phone" type="text" class="w-full p-3 border rounded">
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Rol</label>
          <select v-model="form.role" required class="w-full p-3 border rounded">
            <option value="admin">Admin</option>
            <option value="barber">Barbero</option>
            <option value="client">Cliente</option>
          </select>
        </div>

        <div class="md:col-span-2 flex justify-end gap-4">
          <button 
            type="button" 
            v-if="editId"
            @click="editId = null; Object.assign(form, {name:'',email:'',password:'',password_confirmation:'',phone:'',role:'client'})"
            class="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear Usuario' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.phone || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-for="role in user.roles" :key="role.id" class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-1">
                {{ role.name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>