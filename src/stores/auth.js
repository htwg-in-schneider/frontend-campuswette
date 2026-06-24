import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null
  }),

  getters: {
    isLoggedIn: () => false,
    isAdmin: () => false,
    isUser: () => false
  },

  actions: {
    login() {
      console.warn('Login läuft jetzt über Auth0.')
    },

    logout() {
      console.warn('Logout läuft jetzt über Auth0.')
    },

    refreshCurrentUser() {
      console.warn('Profil wird jetzt über /api/profile geladen.')
    },

    updateProfile() {
      console.warn('Profiländerung wird später über /api/profile umgesetzt.')
    }
  }
})