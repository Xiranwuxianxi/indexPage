import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 文章 Store
 */

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [],
    currentArticle: null,
    loading: false,
    error: null,
  }),
  getters: {
    latestArticles: (state) => state.articles.slice(0, 6),
    categories: (state) => [...new Set(state.articles.map((a) => a.category))],
  },
  actions: {
    async fetchArticles(params = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await api.getArticles(params)
        this.articles = data.list || []
      } catch (err) {
        this.error = err.message || '加载文章失败'
        this.articles = []
      } finally {
        this.loading = false
      }
    },
    async fetchArticle(slug) {
      this.loading = true
      this.error = null
      try {
        this.currentArticle = await api.getArticle(slug)
      } catch (err) {
        this.error = err.message || '加载文章详情失败'
        this.currentArticle = null
      } finally {
        this.loading = false
      }
    },
  },
})
