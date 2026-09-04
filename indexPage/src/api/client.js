/**
 * API client entry.
 *
 * Phase 4: use real backend by default. Configure via VITE_API_BASE_URL.
 * Set VITE_USE_MOCK=true to fall back to mock data.
 */

import { ENDPOINTS } from './endpoints.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
// baseURL 仅为源（origin），如 http://localhost:8080；端点路径已包含 /api/v1 前缀，
// 默认为空字符串时走 Vite dev 代理（/api -> http://localhost:8080）。
const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const TOKEN_KEY = 'xiran_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('xiran_refresh_token')
}

function dispatchUnauthorized() {
  window.dispatchEvent(new window.CustomEvent('xiran:unauthorized'))
}

const wrapResponse = async (response) => {
  const body = await response.json().catch(() => ({}))
  if (body.code !== 200) {
    const err = new Error(body.message || 'Request failed')
    err.code = body.code
    err.data = body.data
    throw err
  }
  return body.data
}

const fetchWithToken = async (url, options = {}, withToken = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = withToken ? getToken() : null
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(`${baseURL}${url}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

const request = async (url, options = {}) => {
  let response = await fetchWithToken(url, options, true)

  // 若携带 token 返回 401，可能是 token 过期/失效或后端密钥缺失。
  // 对公开接口，去掉 token 重试一次即可正常访问；受保护接口会再次 401，
  // 由路由守卫/调用方处理跳转。
  if (response.status === 401 && getToken()) {
    removeToken()
    response = await fetchWithToken(url, options, false)
  }

  if (response.status === 401) {
    dispatchUnauthorized()
    const err = new Error('Session expired, please login again')
    err.code = 401
    throw err
  }

  return wrapResponse(response)
}

async function loadMockApi() {
  const { mockApi } = await import('./mock/index.js')
  return mockApi
}

const mockApiPromise = useMock ? loadMockApi() : null

async function mockCall(method, ...args) {
  const mockApi = await mockApiPromise
  const fn = mockApi[method]
  if (typeof fn !== 'function') {
    throw new Error(`Mock API not implemented: ${method}`)
  }
  return fn(...args)
}

const realApi = {
  getHome: () => request(ENDPOINTS.HOME),

  getTools: (params) => request(`${ENDPOINTS.TOOLS}?${new URLSearchParams(params)}`),
  getTool: (slug) => request(ENDPOINTS.TOOL_DETAIL(slug)),
  execTool: (slug, payload) =>
    request(ENDPOINTS.TOOL_EXEC(slug), { method: 'POST', body: payload }),

  getErrors: (params) => request(`${ENDPOINTS.ERRORS}?${new URLSearchParams(params)}`),
  getError: (slug) => request(ENDPOINTS.ERROR_DETAIL(slug)),

  getArticles: (params) => request(`${ENDPOINTS.ARTICLES}?${new URLSearchParams(params)}`),
  getArticle: (slug) => request(ENDPOINTS.ARTICLE_DETAIL(slug)),

  getProjects: (params) => request(`${ENDPOINTS.PROJECTS}?${new URLSearchParams(params)}`),
  getProject: (slug) => request(ENDPOINTS.PROJECT_DETAIL(slug)),

  search: (params) => request(`${ENDPOINTS.SEARCH}?${new URLSearchParams(params)}`),
  getHotSearches: () => request(ENDPOINTS.HOT_SEARCHES),

  getTutorials: () => request(ENDPOINTS.TUTORIALS),

  getWidgets: () => request(ENDPOINTS.WIDGETS),
  getWorldClock: () => request(ENDPOINTS.WORLD_CLOCK),
  getWeather: (city) => request(ENDPOINTS.WEATHER(city)),
  getMarkets: () => request(ENDPOINTS.MARKETS),

  login: (credentials) => request(ENDPOINTS.AUTH_LOGIN, { method: 'POST', body: credentials }),
  register: (data) => request(ENDPOINTS.AUTH_REGISTER, { method: 'POST', body: data }),
  getMe: () => request(ENDPOINTS.USER_ME),
  logout: () => request(ENDPOINTS.AUTH_LOGOUT, { method: 'POST' }),

  getBookmarks: () => request(ENDPOINTS.USER_BOOKMARKS),
  getHistory: () => request(ENDPOINTS.USER_HISTORY),
  getSavedConfigs: () => request(ENDPOINTS.USER_SAVED_CONFIGS),

  // Admin（管理后台）
  getAdminTools: (params = {}) =>
    request(`${ENDPOINTS.ADMIN_TOOLS}?${new URLSearchParams(params)}`),
  createTool: (data) => request(ENDPOINTS.ADMIN_TOOLS, { method: 'POST', body: data }),
  updateTool: (id, data) => request(ENDPOINTS.ADMIN_TOOL(id), { method: 'PUT', body: data }),
  deleteTool: (id) => request(ENDPOINTS.ADMIN_TOOL(id), { method: 'DELETE' }),

  getAdminProjects: (params = {}) =>
    request(`${ENDPOINTS.ADMIN_PROJECTS}?${new URLSearchParams(params)}`),
  createProject: (data) => request(ENDPOINTS.ADMIN_PROJECTS, { method: 'POST', body: data }),
  updateProject: (id, data) => request(ENDPOINTS.ADMIN_PROJECT(id), { method: 'PUT', body: data }),
  deleteProject: (id) => request(ENDPOINTS.ADMIN_PROJECT(id), { method: 'DELETE' }),
}

const mockApiWrapper = {
  getHome: () => mockCall('getHome'),
  getTools: (params) => mockCall('getTools', params),
  getTool: (slug) => mockCall('getTool', slug),
  execTool: (slug, payload) => mockCall('execTool', slug, payload).catch(() => ({ output: '' })),
  getErrors: (params) => mockCall('getErrors', params),
  getError: (slug) => mockCall('getError', slug),
  getArticles: (params) => mockCall('getArticles', params),
  getArticle: (slug) => mockCall('getArticle', slug),
  getProjects: (params) => mockCall('getProjects', params),
  getProject: (slug) => mockCall('getProject', slug),
  search: (params) => mockCall('search', params),
  getHotSearches: () => mockCall('getHotSearches'),
  getTutorials: () => Promise.resolve([]),
  getWidgets: () => mockCall('getWidgets'),
  getWorldClock: () => mockCall('getWorldClock'),
  getWeather: (city) => mockCall('getWeather', city),
  login: (credentials) => mockCall('login', credentials),
  register: (data) => mockCall('register', data),
  getMe: () => mockCall('getMe'),
  logout: () => mockCall('logout'),
  getBookmarks: () => mockCall('getBookmarks'),
  getHistory: () => mockCall('getHistory'),
  getSavedConfigs: () => mockCall('getSavedConfigs'),
}

export const api = useMock ? mockApiWrapper : realApi

export { ENDPOINTS }
export default api
