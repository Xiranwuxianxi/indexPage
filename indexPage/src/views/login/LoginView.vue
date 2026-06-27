<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await userStore.login({ email: email.value, password: password.value })
  if (userStore.isLoggedIn) {
    router.push('/user')
  }
}

const handleGithubLogin = () => {
  // Phase 4 接入 GitHub OAuth
  alert('GitHub OAuth 将在 Phase 4 接入后端后启用')
}
</script>

<template>
  <main class="page-view">
    <section class="content-panel login-panel" aria-labelledby="login-title">
      <SectionHeading
        variant="page"
        eyebrow="AUTHENTICATION"
        title="登录"
        title-id="login-title"
        lead="登录后可收藏文章、保存配置、查看历史记录。"
      />

      <ErrorMessage v-if="userStore.error" :message="userStore.error" @retry="userStore.error = null" />

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" required placeholder="••••••••" />
        </div>

        <button type="submit" class="action primary" :disabled="userStore.loading">
          {{ userStore.loading ? '登录中…' : '邮箱登录' }}
        </button>
      </form>

      <div class="divider"><span>或</span></div>

      <button type="button" class="action github-button" @click="handleGithubLogin">
        <span aria-hidden="true">🐙</span> 使用 GitHub 登录
      </button>

      <p class="login-hint">Phase 2 为演示登录，任意邮箱/密码均可进入用户中心。</p>
    </section>
  </main>
</template>

<style scoped>
.login-panel {
  max-width: 520px;
  margin: 0 auto;
}

.login-form {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 800;
}

.form-group input {
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--ink);
  font-size: 0.95rem;
}

.form-group input:focus {
  outline: 3px solid rgba(0, 184, 255, 0.2);
  border-color: rgba(0, 184, 255, 0.4);
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: var(--muted);
}

.divider::before,
.divider::after {
  flex: 1;
  height: 1px;
  background: var(--line);
  content: '';
}

.github-button {
  width: 100%;
  color: var(--ink);
  border-color: var(--line);
  background: var(--paper);
}

.login-hint {
  margin-top: 20px;
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
}
</style>
