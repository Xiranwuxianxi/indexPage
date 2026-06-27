/**
 * API client entry.
 *
 * Phase 4: use real backend by default. Configure via VITE_API_BASE_URL.
 * Set VITE_USE_MOCK=true to fall back to mock data.
 */

import { ENDPOINTS } from './endpoints.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const TOKEN_KEY = 'xiran_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('xiran_refresh_token')
}

function dispatchUnauthorized() {
  window.dispatchEvent(new CustomEvent('xiran:unauthorized'))
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

const request = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 401) {
    removeToken()
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

  login: (credentials) => request(ENDPOINTS.AUTH_LOGIN, { method: 'POST', body: credentials }),
  getMe: () => request(ENDPOINTS.USER_ME),
  logout: () => request(ENDPOINTS.AUTH_LOGOUT, { method: 'POST' }),

  getBookmarks: () => request(ENDPOINTS.USER_BOOKMARKS),
  getHistory: () => request(ENDPOINTS.USER_HISTORY),
  getSavedConfigs: () => request(ENDPOINTS.USER_SAVED_CONFIGS),
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
  login: (credentials) => mockCall('login', credentials),
  getMe: () => mockCall('getMe'),
  logout: () => mockCall('logout'),
  getBookmarks: () => mockCall('getBookmarks'),
  getHistory: () => mockCall('getHistory'),
  getSavedConfigs: () => mockCall('getSavedConfigs'),
}

export const api = useMock ? mockApiWrapper : realApi

export { ENDPOINTS }
export default api
