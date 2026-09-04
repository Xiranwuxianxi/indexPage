import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 错误知识库 Store
 */

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [],
    currentError: null,
    loading: false,
    error: null,
  }),
  getters: {
    categories: (state) => [...new Set(state.errors.map((e) => e.category))],
  },
  actions: {
    async fetchErrors(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await api.getErrors(params)
        this.errors = data.records || data.list || []
      } catch (err) {
        this.error = err.message || '加载错误条目失败'
        this.errors = []
      } finally {
        this.loading = false
      }
    },
    async fetchError(slug) {
      this.loading = true
      this.error = null
      try {
        this.currentError = await api.getError(slug)
      } catch (err) {
        this.error = err.message || '加载错误详情失败'
        this.currentError = null
      } finally {
        this.loading = false
      }
    },
  },
})
