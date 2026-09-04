<script setup>
defineProps({
  link: {
    type: Object,
    required: true,
  },
  revealClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <a
    class="social-card"
    :class="[revealClass, `is-${link.tone}`]"
    :href="link.href"
    target="_blank"
    rel="me noopener noreferrer"
  >
    <span>{{ link.handle }}</span>
    <strong>{{ link.label }}</strong>
    <p v-if="link.summary">{{ link.summary }}</p>
  </a>
</template>

<style scoped>
.social-card {
  display: grid;
  gap: 8px;
  min-height: 180px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.35s var(--ease-out),
    border-color 0.35s var(--ease-out),
    background 0.35s var(--ease-out);
  will-change: transform;
}

.social-card:hover {
  transform: translateY(-3px) scale(1.01);
  transition-timing-function: var(--ease-spring);
}

.social-card span {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 800;
}

.social-card strong {
  color: var(--ink);
  font-size: clamp(1.45rem, 4vw, 2.1rem);
  font-weight: 950;
  line-height: 1.05;
}

.social-card p {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.social-card.is-cyan {
  border-color: rgba(var(--brand-rgb), 0.38);
  box-shadow: 0 14px 36px rgba(var(--brand-rgb), 0.12);
}

.social-card.is-pink {
  border-color: rgba(255, 79, 195, 0.36);
  box-shadow: 0 14px 36px rgba(255, 79, 195, 0.1);
}

.social-card.is-gold {
  border-color: rgba(244, 166, 42, 0.38);
  box-shadow: 0 14px 36px rgba(244, 166, 42, 0.1);
}

.social-card.is-green {
  border-color: rgba(23, 199, 132, 0.38);
  box-shadow: 0 14px 36px rgba(23, 199, 132, 0.1);
}

.social-card:hover.is-cyan {
  box-shadow: 0 20px 48px rgba(var(--brand-rgb), 0.18);
}

.social-card:hover.is-pink {
  box-shadow: 0 20px 48px rgba(255, 79, 195, 0.16);
}

.social-card:hover.is-gold {
  box-shadow: 0 20px 48px rgba(244, 166, 42, 0.16);
}

.social-card:hover.is-green {
  box-shadow: 0 20px 48px rgba(23, 199, 132, 0.16);
}
</style>
