<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import SectionHeading from '../../components/SectionHeading.vue'
import AppSkeleton from '../../components/common/AppSkeleton.vue'
import ErrorMessage from '../../components/common/ErrorMessage.vue'
import api from '../../api/client.js'

const route = useRoute()
const category = computed(() => route.params.category)

const categories = ref([])
const loading = ref(false)
const error = ref(null)

const currentCategory = computed(() =>
  categories.value.find((c) => c.slug === category.value),
)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    categories.value = await api.getTutorials()
  } catch (err) {
    error.value = err.message || 'Failed to load tutorials'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="tutorials-title">
      <SectionHeading
        variant="page"
        eyebrow="TUTORIALS"
        title="Tutorial Center"
        title-id="tutorials-title"
        :lead="currentCategory ? `${currentCategory.name} tutorials` : 'Systematic tutorials covering deployment, backend, frontend and AI engineering.'"
      />

      <AppSkeleton v-if="loading" :lines="4" />
      <ErrorMessage v-else-if="error" :message="error" @retry="$router.go(0)" />

      <template v-else>
        <section class="tutorial-grid" aria-label="Tutorial categories">
          <RouterLink
            v-for="item in categories"
            :key="item.slug"
            class="tutorial-card"
            :to="`/tutorials/${item.slug}`"
            :class="{ 'is-active': category === item.slug }"
          >
            <strong>{{ item.name }}</strong>
            <span>{{ item.count }} tutorials</span>
          </RouterLink>
        </section>

        <div class="tutorial-placeholder">
          <p>Tutorial content will be dynamically rendered after backend content system integration.</p>
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
.tutorial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.tutorial-card {
  display: grid;
  gap: 8px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-decoration: none;
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out);
}

.tutorial-card:hover,
.tutorial-card.is-active {
  transform: translateY(-4px);
  border-color: var(--line-strong);
}

.tutorial-card.is-active {
  background: rgba(var(--brand-rgb), 0.06);
}

.tutorial-card strong {
  font-size: 1.15rem;
  font-weight: 950;
}

.tutorial-card span {
  color: var(--muted);
  font-size: 0.9rem;
}

.tutorial-placeholder {
  margin-top: 32px;
  padding: 32px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 980px) {
  .tutorial-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .tutorial-grid {
    grid-template-columns: 1fr;
  }
}
</style>
