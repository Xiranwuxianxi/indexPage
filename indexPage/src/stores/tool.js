import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 工具 Store
 *
 * Phase 2：从 Mock API 加载工具列表与详情。
 * Phase 4：切换 api 客户端为真实后端即可。
 */

export const useToolStore = defineStore('tool', {
  state: () => ({
    tools: [],
    currentTool: null,
    loading: false,
    error: null,
  }),
  getters: {
    hotTools: (state) => state.tools.slice(0, 6),
    categories: (state) => [...new Set(state.tools.map((t) => t.category))],
  },
  actions: {
    async fetchTools(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await api.getTools(params)
        this.tools = data.records || data.list || []
      } catch (err) {
        this.error = err.message || '加载工具失败'
        this.tools = []
      } finally {
        this.loading = false
      }
    },
    async fetchTool(slug) {
      this.loading = true
      this.error = null
      try {
        this.currentTool = await api.getTool(slug)
      } catch (err) {
        this.error = err.message || '加载工具详情失败'
        this.currentTool = null
      } finally {
        this.loading = false
      }
    },
  },
})
