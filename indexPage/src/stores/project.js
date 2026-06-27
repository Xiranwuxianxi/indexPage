import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 项目 Store
 */

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    selectedType: '全部',
    loading: false,
    error: null,
  }),
  getters: {
    projectTypes: (state) => ['全部', ...new Set(state.projects.map((p) => p.type))],
    filteredProjects: (state) => {
      if (state.selectedType === '全部') return state.projects
      return state.projects.filter((p) => p.type === state.selectedType)
    },
    featuredProjects: (state) => state.projects.slice(0, 6),
  },
  actions: {
    setSelectedType(type) {
      this.selectedType = type
    },
    async fetchProjects(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await api.getProjects(params)
        this.projects = data.list || []
      } catch (err) {
        this.error = err.message || '加载项目失败'
        this.projects = []
      } finally {
        this.loading = false
      }
    },
    async fetchProject(slug) {
      this.loading = true
      this.error = null
      try {
        this.currentProject = await api.getProject(slug)
      } catch (err) {
        this.error = err.message || '加载项目详情失败'
        this.currentProject = null
      } finally {
        this.loading = false
      }
    },
  },
})
