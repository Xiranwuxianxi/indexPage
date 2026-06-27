<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  revealClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['mousemove', 'mouseleave'])

const handleMouseMove = (event) => {
  emit('mousemove', event)
}

const handleMouseLeave = (event) => {
  emit('mouseleave', event)
}

const cardClasses = computed(() => {
  const classes = ['project-card']
  if (props.revealClass) {
    classes.push(...props.revealClass.split(' '))
  }
  return classes
})
</script>

<template>
  <a
    :class="cardClasses"
    :href="project.href"
    target="_blank"
    rel="noreferrer"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <span class="project-icon" aria-hidden="true">{{ project.icon }}</span>
    <span class="project-type">{{ project.type }}</span>
    <h3>{{ project.name }}</h3>
    <p>{{ project.summary }}</p>
    <ul v-if="project.tags?.length" class="project-tags" aria-label="技术标签">
      <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
    </ul>
    <span class="project-status">
      <span class="status-light"></span>
      {{ project.status }}
    </span>
  </a>
</template>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  box-shadow: 0 16px 40px rgba(63, 112, 153, 0.1);
  transition:
    transform 0.35s var(--ease-out),
    border-color 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
  will-change: transform;
}

.project-card::before {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  content: '';
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 184, 255, 0.12),
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.35s var(--ease-out);
  pointer-events: none;
}

.project-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-hover);
  transition-timing-function: var(--ease-spring);
}

.project-card:hover::before {
  opacity: 1;
}

html.dark .project-icon {
  background: rgba(0, 184, 255, 0.14);
}

html.dark .project-type {
  border-color: rgba(0, 184, 255, 0.35);
  color: #4fd1ff;
  background: rgba(0, 184, 255, 0.12);
}

html.dark .project-tags li {
  background: rgba(0, 184, 255, 0.12);
}

html.dark .project-card::before {
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 184, 255, 0.18),
    transparent 50%
  );
}

.project-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: rgba(0, 184, 255, 0.08);
  font-size: 1.35rem;
  line-height: 1;
}

.project-type {
  align-self: flex-start;
  padding: 5px 10px;
  border: 1px solid rgba(0, 184, 255, 0.26);
  border-radius: 8px;
  color: #0078b4;
  background: rgba(0, 184, 255, 0.07);
  font-size: 0.74rem;
  font-weight: 950;
}

.project-card h3 {
  margin-top: 22px;
  color: var(--ink);
  font-size: clamp(1.22rem, 2.2vw, 1.62rem);
  font-weight: 950;
  line-height: 1.18;
}

.project-card p {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.75;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.project-tags li {
  padding: 4px 10px;
  border-radius: 6px;
  color: var(--soft);
  background: rgba(0, 184, 255, 0.07);
  font-size: 0.74rem;
  font-weight: 800;
}

.project-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 24px;
  color: var(--soft);
  font-size: 0.82rem;
  font-weight: 800;
}

@media (max-width: 640px) {
  .project-card {
    min-height: 260px;
  }
}
</style>
