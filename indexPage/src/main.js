import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user.js'
import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

window.addEventListener('xiran:unauthorized', () => {
  const userStore = useUserStore()
  userStore.handleUnauthorized()
  // 不再无条件跳登录页；路由守卫会在访问受保护页面时处理跳转，
  // 避免公开页面因某个请求 401 被强制踢走。
})

const userStore = useUserStore()
userStore.fetchProfile().finally(() => {
  app.mount('#app')
})
