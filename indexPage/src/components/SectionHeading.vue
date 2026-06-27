<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleId: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'section',
    validator: (value) => ['section', 'page'].includes(value),
  },
  headingLevel: {
    type: String,
    default: undefined,
  },
  lead: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div :class="variant === 'page' ? 'page-heading' : 'section-heading'">
    <div>
      <p class="eyebrow">{{ eyebrow }}</p>
      <component :is="headingLevel || (variant === 'page' ? 'h1' : 'h2')" :id="titleId">
        {{ title }}
      </component>
      <p v-if="lead" class="page-lead">{{ lead }}</p>
    </div>
  </div>
</template>

<style scoped>
.section-heading,
.page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.section-heading {
  margin: clamp(44px, 7vw, 76px) 0 22px;
  animation: fade-up 0.8s var(--ease-out) both;
  animation-delay: 0.2s;
}

.section-heading h2,
.page-heading h1 {
  color: var(--ink);
  font-size: clamp(2.1rem, 6vw, 4.4rem);
  font-weight: 950;
  line-height: 1;
}

.page-lead {
  max-width: 640px;
  margin-top: 16px;
  font-size: 1.02rem;
  color: var(--muted);
  line-height: 1.85;
}

@media (max-width: 640px) {
  .section-heading,
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
