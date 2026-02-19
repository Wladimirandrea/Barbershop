<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const users = ref([])
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  role: 'client',
  avatar: null,
  avatarPreview: null
})
const editId = ref(null)
const loading = ref(false)
const error = ref('')

const fetchUsers = async () => {
  try {
    const res = await axios.get('/admin/users')
    users.value = res.data
  } catch (err) {
    error.value = t('users.error_load')
  }
}

const handleAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.avatar = file
    const reader = new FileReader()
    reader.onload = (event) => {
      form.value.avatarPreview = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveUser = async () => {
  loading.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('email', form.value.email)
  formData.append('phone', form.value.phone || '')
  formData.append('role', form.value.role)

  if (form.value.password) {
    formData.append('password', form.value.password)
    formData.append('password_confirmation', form.value.password_confirmation)
  }

  if (form.value.avatar) {
    formData.append('avatar', form.value.avatar)
  }

  try {
    if (editId.value) {
      await axios.post(`/admin/users/${editId.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        }
      })
    } else {
      await axios.post('/admin/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    resetForm()
    fetchUsers()
  } catch (err) {
    error.value = err.response?.data?.message || t('users.error_save')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editId.value = null
  form.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'client',
    avatar: null,
    avatarPreview: null
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
    avatar: null,
    avatarPreview: user.avatar ? `/storage/${user.avatar}` : null
  }
}

const deleteUser = async (id) => {
  if (!confirm(t('users.confirm_delete'))) return
  try {
    await axios.delete(`/admin/users/${id}`)
    fetchUsers()
  } catch (err) {
    error.value = t('users.error_delete')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-6 max-w-[1400px] mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">{{ t('users.title') }}</h1>

    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
      <!-- Lista de usuarios -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 order-2 lg:order-1">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">{{ t('users.list') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.avatar') }}</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('auth.name') }}</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('auth.email') }}</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('auth.phone') }}</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.role') }}</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ t('users.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img :src="user.avatar ? `/storage/${user.avatar}` : '/storage/avatars/default.png'"
                    :alt="user.name"
                    class="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.phone || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-for="role in user.roles" :key="role.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                    {{ t(`users.roles.${role.name}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                    {{ t('users.edit_btn') }}
                  </button>
                  <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900 transition-colors">
                    {{ t('users.delete_btn') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 order-1 lg:order-2">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ editId ? t('users.edit') : t('users.create') }}
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveUser" class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.name') }}</label>
                <input v-model="form.name" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.email') }}</label>
                <input v-model="form.email" type="email" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ t('auth.password') }} {{ editId ? t('users.password_hint') : '' }}
                </label>
                <input v-model="form.password" type="password" :required="!editId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.confirm_password') }}</label>
                <input v-model="form.password_confirmation" type="password" :required="!editId"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('auth.phone') }}</label>
                <input v-model="form.phone" type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('users.role') }}</label>
                <select v-model="form.role" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="admin">{{ t('users.roles.admin') }}</option>
                  <option value="barber">{{ t('users.roles.barber') }}</option>
                  <option value="client">{{ t('users.roles.client') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('users.avatar') }}</label>
                <input type="file" accept="image/*" @change="handleAvatarChange"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div class="mt-4 flex justify-center">
                  <img v-if="form.avatarPreview" :src="form.avatarPreview" alt="Preview"
                    class="w-40 h-40 object-cover rounded-full border-4 border-gray-200 shadow-lg">
                  <img v-else src="/storage/avatars/default.png" alt="Default"
                    class="w-40 h-40 object-cover rounded-full border-4 border-gray-200 shadow-lg">
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4 pt-6 border-t">
              <button v-if="editId" type="button" @click="resetForm"
                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                {{ t('users.cancel') }}
              </button>
              <button type="submit" :disabled="loading"
                class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {{ loading ? t('users.saving') : editId ? t('users.update') : t('users.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>