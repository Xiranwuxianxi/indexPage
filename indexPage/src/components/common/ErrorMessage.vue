<script setup>
defineProps({
  message: {
    type: String,
    default: '加载失败，请稍后重试。',
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="error-message" role="alert">
    <span aria-hidden="true">⚠️</span>
    <span>{{ message }}</span>
    <button v-if="$emit" type="button" class="retry-button" @click="emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(255, 79, 195, 0.3);
  border-radius: 12px;
  color: var(--ink);
  background: rgba(255, 79, 195, 0.08);
}

.retry-button {
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid rgba(255, 79, 195, 0.4);
  border-radius: 8px;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.6);
  font-weight: 800;
  cursor: pointer;
}

.retry-button:hover {
  background: rgba(255, 255, 255, 0.9);
}
</style>
