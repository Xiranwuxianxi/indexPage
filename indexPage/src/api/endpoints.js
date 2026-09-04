/**
 * API endpoint definitions.
 * Central declaration for frontend-backend interaction.
 */

export const ENDPOINTS = {
  // Home aggregate
  HOME: '/api/v1/home',

  // Tools
  TOOLS: '/api/v1/tools',
  TOOL_DETAIL: (slug) => `/api/v1/tools/${slug}`,
  TOOL_EXEC: (slug) => `/api/v1/tools/${slug}/exec`,

  // Errors
  ERRORS: '/api/v1/errors',
  ERROR_DETAIL: (slug) => `/api/v1/errors/${slug}`,

  // Articles
  ARTICLES: '/api/v1/articles',
  ARTICLE_DETAIL: (slug) => `/api/v1/articles/${slug}`,

  // Tutorials
  TUTORIALS: '/api/v1/tutorials',

  // Projects
  PROJECTS: '/api/v1/projects',
  PROJECT_DETAIL: (slug) => `/api/v1/projects/${slug}`,

  // Search
  SEARCH: '/api/v1/search',
  HOT_SEARCHES: '/api/v1/search/hot',

  // Auth
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_GITHUB: '/api/v1/auth/github',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_LOGOUT: '/api/v1/auth/logout',

  // User
  USER_ME: '/api/v1/user/me',
  USER_BOOKMARKS: '/api/v1/user/bookmarks',
  USER_HISTORY: '/api/v1/user/history',
  USER_SAVED_CONFIGS: '/api/v1/user/saved-configs',
  USER_SUBSCRIPTION: '/api/v1/user/subscriptions',

  // Widgets (首页小组件：平台入口 / 实用工具 / 世界时钟 / 天气)
  WIDGETS: '/api/v1/widgets',
  WORLD_CLOCK: '/api/v1/widgets/world-clock',
  WEATHER: (city) => `/api/v1/widgets/weather?city=${city}`,
  MARKETS: '/api/v1/widgets/markets',

  // Admin（管理后台，需 ADMIN/EDITOR 角色）
  ADMIN_TOOLS: '/api/v1/admin/tools',
  ADMIN_TOOL: (id) => `/api/v1/admin/tools/${id}`,
  ADMIN_PROJECTS: '/api/v1/admin/projects',
  ADMIN_PROJECT: (id) => `/api/v1/admin/projects/${id}`,
}
