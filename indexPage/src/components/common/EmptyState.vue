<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无内容',
  },
  description: {
    type: String,
    default: '这里还没有数据，稍后再来看看吧。',
  },
})
</script>

<template>
  <div class="empty-state" role="status">
    <span class="empty-icon" aria-hidden="true">📭</span>
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 48px 24px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  color: var(--muted);
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.7;
}

.empty-state strong {
  color: var(--ink);
  font-size: 1.1rem;
}

.empty-state p {
  max-width: 420px;
  line-height: 1.7;
}
</style>
