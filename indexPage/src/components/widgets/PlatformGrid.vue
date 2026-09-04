<script setup>
defineProps({
  platforms: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="loading" class="platform-grid">
    <div v-for="i in 3" :key="i" class="platform-skeleton" />
  </div>
  <div v-else class="platform-grid">
    <a
      v-for="platform in platforms"
      :key="platform.key"
      class="platform-card"
      :href="platform.href"
      target="_blank"
      rel="noopener"
    >
      <span class="platform-icon" aria-hidden="true">{{ platform.icon }}</span>
      <span class="platform-name">{{ platform.name }}</span>
      <span class="platform-subtitle">{{ platform.subtitle }}</span>
      <p>{{ platform.description }}</p>
      <span class="platform-link">访问平台</span>
    </a>
  </div>
</template>

<style scoped>
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.platform-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(var(--brand-rgb), 0.06);
  transition:
    transform 0.35s var(--ease-out),
    border-color 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
}

.platform-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-hover);
}

.platform-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-bottom: 14px;
  border: 1px solid rgba(var(--brand-rgb), 0.18);
  border-radius: 12px;
  background: rgba(var(--brand-rgb), 0.07);
  font-size: 1.4rem;
  line-height: 1;
}

.platform-name {
  font-size: 1.2rem;
  font-weight: 950;
  line-height: 1.2;
}

.platform-subtitle {
  align-self: flex-start;
  margin-top: 8px;
  padding: 4px 10px;
  border: 1px solid rgba(var(--brand-rgb), 0.26);
  border-radius: 8px;
  color: var(--brand);
  background: rgba(var(--brand-rgb), 0.07);
  font-size: 0.74rem;
  font-weight: 950;
}

.platform-card p {
  margin-top: 12px;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.75;
}

.platform-link {
  margin-top: auto;
  padding-top: 16px;
  color: var(--cyan);
  font-size: 0.9rem;
  font-weight: 900;
}

.platform-skeleton {
  min-height: 200px;
  border-radius: 14px;
  background: rgba(var(--brand-rgb), 0.06);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

html.dark .platform-subtitle {
  border-color: rgba(var(--brand-rgb), 0.35);
  color: #4fd1ff;
  background: rgba(var(--brand-rgb), 0.12);
}

@media (max-width: 1100px) {
  .platform-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .platform-grid {
    grid-template-columns: 1fr;
  }
}
</style>
