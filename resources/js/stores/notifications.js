// resources/js/stores/notifications.js
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    newUsers: [],
  }),

  getters: {
    newUsersCount: (state) => state.newUsers.length,
  },

  actions: {
    addUser(user) {
      this.newUsers.unshift(user)  // ✅ this, no state
    },
    reset() {
      this.newUsers = []
    }
  }
})