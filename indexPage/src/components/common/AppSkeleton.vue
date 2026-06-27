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
  background: linear-gradient(90deg, var(--line) 25%, rgba(0, 184, 255, 0.08) 50%, var(--line) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
  }
}
</style>
