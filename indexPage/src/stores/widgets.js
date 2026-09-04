import { defineStore } from 'pinia'
import api from '../api/client.js'

/**
 * 首页小组件 Store
 *
 * 对接后端 widget 模块：
 * - GET /api/v1/widgets           平台入口 + 实用工具列表
 * - GET /api/v1/widgets/world-clock  北京/伦敦/纽约三地当前时间
 * - GET /api/v1/widgets/weather?city=  指定城市天气（open-meteo 代理 + 兜底）
 */

const WEATHER_CITIES = ['beijing', 'london', 'washington']

export const useWidgetStore = defineStore('widgets', {
  state: () => ({
    platforms: [],
    utilities: [],
    worldClock: { updatedAt: null, cities: [] },
    weather: {},
    markets: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchWidgets() {
      this.loading = true
      this.error = null
      try {
        const data = await api.getWidgets()
        this.platforms = data.platforms || []
        this.utilities = data.utilities || []
      } catch (err) {
        this.error = err.message || '加载小组件失败'
      } finally {
        this.loading = false
      }
    },

    async fetchWorldClock() {
      try {
        this.worldClock = await api.getWorldClock()
      } catch (err) {
        this.error = err.message || '加载世界时间失败'
      }
    },

    async fetchWeather() {
      try {
        // 单个城市失败不影响其它城市（如海外接口偶发超时）
        const results = await Promise.allSettled(
          WEATHER_CITIES.map((city) => api.getWeather(city)),
        )
        const map = {}
        results.forEach((r) => {
          if (r.status === 'fulfilled' && r.value && r.value.city) {
            map[r.value.city] = r.value
          }
        })
        this.weather = map
      } catch (err) {
        this.error = err.message || '加载天气失败'
      }
    },

    async fetchMarkets() {
      try {
        this.markets = await api.getMarkets()
      } catch {
        this.markets = []
      }
    },

    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        await Promise.all([
          this.fetchWidgets(),
          this.fetchWorldClock(),
          this.fetchWeather(),
          this.fetchMarkets(),
        ])
      } finally {
        this.loading = false
      }
    },
  },
})
