import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 首页聚合数据 Store
 *
 * Phase 2：从 /api/v1/home Mock 接口加载首页所有模块数据。
 * Phase 4：后端提供真实 /api/v1/home 聚合接口。
 */

const defaultHero = {
  eyebrow: 'XIRAN DEVELOPER PLATFORM',
  title: '希燃呀',
  subtitle: '面向开发者的在线工具、报错解决方案与工程实验平台',
  description: '当你遇到 Nginx、Spring Boot、Vue、Docker 或 AI 工程化问题时，在这里搜索错误、使用工具、阅读解决方案，并把配置保存下来。',
  primaryAction: { text: '使用在线工具', href: '/tools' },
  secondaryAction: { text: '搜索错误', href: '/errors' },
  tertiaryAction: { text: '浏览项目', href: '/projects' },
}

export const useHomeStore = defineStore('home', {
  state: () => ({
    hero: { ...defaultHero },
    hotTools: [],
    commonErrors: [],
    featuredProjects: [],
    latestArticles: [],
    focusAreas: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchHome() {
      this.loading = true
      this.error = null
      try {
        const data = await api.getHome()
        this.hero = data.hero || defaultHero
        this.hotTools = data.hotTools || []
        this.commonErrors = data.commonErrors || []
        this.featuredProjects = data.featuredProjects || []
        this.latestArticles = data.latestArticles || []
        this.focusAreas = data.focusAreas || []
      } catch (err) {
        this.error = err.message || '加载首页数据失败'
      } finally {
        this.loading = false
      }
    },
  },
})
