import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 搜索 Store
 */

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    results: [],
    hotSearches: [],
    loading: false,
    error: null,
    filters: {
      type: 'all',
      category: 'all',
    },
  }),
  getters: {
    hasResults: (state) => state.results.length > 0,
  },
  actions: {
    setQuery(query) {
      this.query = query
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },
    async search(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await api.search({ q: this.query, ...this.filters, ...params })
        this.results = data.list || []
      } catch (err) {
        this.error = err.message || '搜索失败'
        this.results = []
      } finally {
        this.loading = false
      }
    },
    async fetchHotSearches() {
      try {
        this.hotSearches = await api.getHotSearches()
      } catch {
        this.hotSearches = []
      }
    },
  },
})
