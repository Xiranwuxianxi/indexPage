<script setup>
defineProps({
  lines: {
    type: Number,
    default: 3,
  },
})
</script>

<template>
  <div class="skeleton" aria-label="加载中" aria-busy="true">
    <div v-for="i in lines" :key="i" class="skeleton-line" :style="{ width: `${60 + (i % 3) * 20}%` }" />
  </div>
</template>

<style scoped>
.skeleton {
  display: grid;
  gap: 10px;
  padding: 16px;
}

.skeleton-line {
  height: 16px;
  border-radius: 8px;
  background: rgba(var(--brand-rgb), 0.08);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
  }
}
</style>
