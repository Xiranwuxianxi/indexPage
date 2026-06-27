<script setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <section aria-labelledby="settings-title">
    <h2 id="settings-title" class="section-title">账号设置</h2>

    <div v-if="user" class="settings-card">
      <div class="setting-row">
        <span>昵称</span>
        <strong>{{ user.nickname }}</strong>
      </div>
      <div class="setting-row">
        <span>邮箱</span>
        <strong>{{ user.email }}</strong>
      </div>
      <div class="setting-row">
        <span>角色</span>
        <strong>{{ user.role }}</strong>
      </div>
      <div class="setting-row">
        <span>个人简介</span>
        <p>{{ user.bio }}</p>
      </div>

      <button type="button" class="action secondary" @click="userStore.logout()">退出登录</button>
    </div>
  </section>
</template>

<style scoped>
.section-title {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 950;
}

.settings-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.setting-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.setting-row span {
  color: var(--muted);
  font-size: 0.9rem;
}

.setting-row strong,
.setting-row p {
  color: var(--ink);
  margin: 0;
}

@media (max-width: 640px) {
  .setting-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
