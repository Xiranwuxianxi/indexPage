<script setup>
// 快捷导航：常用站点直达（静态配置，可按需增删）
const links = [
  { name: 'Steam', href: 'https://store.steampowered.com', icon: '🎮' },
  { name: 'B 站', href: 'https://www.bilibili.com', icon: '📺' },
  { name: 'ChatGPT', href: 'https://chatgpt.com', icon: '🤖' },
  { name: '抖音', href: 'https://www.douyin.com', icon: '🎵' },
  { name: 'chsrc', href: 'https://chsrc.run', icon: '🔁' },
  { name: 'GitHub', href: 'https://github.com', icon: '🐙' },
]
</script>

<template>
  <nav class="quick-links" aria-label="快捷导航">
    <a
      v-for="link in links"
      :key="link.name"
      class="quick-link"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="quick-icon" aria-hidden="true">{{ link.icon }}</span>
      {{ link.name }}
    </a>
  </nav>
</template>

<style scoped>
.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  background: var(--paper);
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s var(--ease-out),
    border-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.quick-link:hover {
  transform: translateY(-2px);
  border-color: var(--line-strong);
  box-shadow: 0 10px 24px rgba(var(--brand-rgb), 0.12);
}

.quick-icon {
  font-size: 1.05rem;
  line-height: 1;
}
</style>
