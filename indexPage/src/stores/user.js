import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * User store. Phase 4: connect to real backend JWT.
 */

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('xiran_token') || null,
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isEditor: (state) => ['ADMIN', 'EDITOR'].includes(state.user?.role),
  },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const data = await api.login(credentials)
        this.token = data.accessToken
        this.user = data.user
        localStorage.setItem('xiran_token', data.accessToken)
        localStorage.setItem('xiran_refresh_token', data.refreshToken)
      } catch (err) {
        this.error = err.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    async fetchProfile() {
      if (!this.token) return
      this.loading = true
      try {
        this.user = await api.getMe()
      } catch (err) {
        this.error = err.message || 'Failed to load user info'
        this.logout()
      } finally {
        this.loading = false
      }
    },
    logout() {
      api.logout().catch(() => {})
      this.user = null
      this.token = null
      localStorage.removeItem('xiran_token')
      localStorage.removeItem('xiran_refresh_token')
    },
    handleUnauthorized() {
      this.logout()
    },
  },
})
