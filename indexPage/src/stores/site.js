import { defineStore } from 'pinia'

/**
 * 站点全局 Store
 *
 * Phase 2 调整：
 * - 移除原本写死的项目、文章、社交平台、技术方向等数据。
 * - 保留品牌、导航、全局 UI 状态。
 * - 业务数据迁移到独立的 tool/article/project/user/search stores。
 */

export const useSiteStore = defineStore('site', {
  state: () => ({
    avatarUrl: '/avatar.png',
    brand: '希燃呀',
    brandEn: 'XIRAN DIGITAL LAB',
    siteName: '希燃呀开发者平台',
    tagline: '面向开发者的在线工具、报错解决方案与工程实验平台。',
    signals: ['Online Tools', 'Error Solutions', 'Dev Lab'],
  }),
  getters: {
    metrics: () => [
      { value: '6+', label: '在线工具' },
      { value: '3+', label: '解决方案' },
      { value: '持续', label: '更新中' },
    ],
  },
  actions: {},
})
