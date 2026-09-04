import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * User store. Connected to real backend JWT.
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
    _setAuth(data) {
      this.token = data.accessToken
      this.user = data.user
      localStorage.setItem('xiran_token', data.accessToken)
      localStorage.setItem('xiran_refresh_token', data.refreshToken)
    },
    _clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('xiran_token')
      localStorage.removeItem('xiran_refresh_token')
    },
    async register(credentials) {
      this.loading = true
      this.error = null
      try {
        const data = await api.register(credentials)
        this._setAuth(data)
      } catch (err) {
        this.error = err.message || 'Register failed'
      } finally {
        this.loading = false
      }
    },
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const data = await api.login(credentials)
        this._setAuth(data)
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
      } catch {
        // 静默清理过期凭证，不触发跳转，由路由守卫控制页面访问
        this._clearAuth()
      } finally {
        this.loading = false
      }
    },
    logout() {
      api.logout().catch(() => {})
      this._clearAuth()
    },
    handleUnauthorized() {
      this._clearAuth()
    },
  },
})
