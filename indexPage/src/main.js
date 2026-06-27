import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user.js'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

window.addEventListener('xiran:unauthorized', () => {
  const userStore = useUserStore()
  userStore.handleUnauthorized()
  if (router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})

app.mount('#app')
