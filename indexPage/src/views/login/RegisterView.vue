<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const username = ref('')
const email = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  userStore.error = null
  if (password.value !== confirmPassword.value) {
    userStore.error = '两次输入的密码不一致'
    return
  }
  await userStore.register({
    username: username.value,
    email: email.value,
    nickname: nickname.value,
    password: password.value,
  })
  if (userStore.isLoggedIn) {
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/user')
  }
}
</script>

<template>
  <main class="page-view">
    <section class="content-panel login-panel" aria-labelledby="register-title">
      <SectionHeading
        variant="page"
        eyebrow="CREATE ACCOUNT"
        title="注册"
        title-id="register-title"
        lead="注册后自动登录，可收藏文章、保存配置、查看历史记录。"
      />

      <ErrorMessage
        v-if="userStore.error"
        :message="userStore.error"
        @retry="userStore.error = null"
      />

      <form class="login-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input id="username" v-model="username" type="text" required minlength="2" placeholder="你的用户名" />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
        </div>

        <div class="form-group">
          <label for="nickname">昵称（可选）</label>
          <input id="nickname" v-model="nickname" type="text" placeholder="默认使用用户名" />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" required minlength="6" placeholder="至少 6 位" />
        </div>

        <div class="form-group">
          <label for="confirm-password">确认密码</label>
          <input id="confirm-password" v-model="confirmPassword" type="password" required placeholder="再次输入密码" />
        </div>

        <button type="submit" class="action primary" :disabled="userStore.loading">
          {{ userStore.loading ? '注册中…' : '注册并登录' }}
        </button>
      </form>

      <p class="login-hint">
        已有账号？
        <RouterLink class="switch-link" to="/login">去登录</RouterLink>
      </p>
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
  outline: 3px solid rgba(var(--brand-rgb), 0.25);
  border-color: rgba(var(--brand-rgb), 0.5);
}

.login-hint {
  margin-top: 20px;
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
}

.switch-link {
  color: var(--brand);
  font-weight: 800;
  text-decoration: none;
}

.switch-link:hover {
  text-decoration: underline;
}
</style>
