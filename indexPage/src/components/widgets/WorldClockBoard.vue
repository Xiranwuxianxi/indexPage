<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  cities: {
    type: Array,
    default: () => [],
  },
  weather: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// 客户端每秒跳动一次，按各城市时区实时计算，科技感数字时钟
const now = ref(Date.now())
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const timeFormatterCache = new Map()
const dateFormatterCache = new Map()

function formatTime(tz) {
  if (!timeFormatterCache.has(tz)) {
    timeFormatterCache.set(
      tz,
      new Intl.DateTimeFormat('zh-CN', {
        timeZone: tz,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    )
  }
  return timeFormatterCache.get(tz).format(now.value)
}

function formatDate(tz) {
  if (!dateFormatterCache.has(tz)) {
    dateFormatterCache.set(
      tz,
      new Intl.DateTimeFormat('zh-CN', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }),
    )
  }
  return dateFormatterCache.get(tz).format(now.value)
}

const merged = computed(() =>
  props.cities.map((city) => ({
    ...city,
    weather: props.weather[city.key] || null,
  })),
)
</script>

<template>
  <div v-if="loading" class="clock-grid">
    <div v-for="i in 3" :key="i" class="clock-skeleton" />
  </div>
  <div v-else-if="merged.length" class="clock-grid">
    <div v-for="city in merged" :key="city.key" class="clock-card">
      <span class="corner corner-tl" aria-hidden="true" />
      <span class="corner corner-br" aria-hidden="true" />

      <div class="clock-head">
        <span class="clock-name">
          <span class="signal-dot" aria-hidden="true" />
          {{ city.city }}
        </span>
        <span class="clock-country">{{ city.country }}</span>
      </div>

      <p class="clock-time">{{ formatTime(city.timezone) }}</p>
      <p class="clock-date">{{ formatDate(city.timezone) }}</p>
      <p class="clock-tz">{{ city.timezone }} · UTC{{ city.utcOffset }}</p>

      <div v-if="city.weather" class="weather-block">
        <span class="weather-icon" aria-hidden="true">{{ city.weather.icon }}</span>
        <span class="weather-temp">{{ city.weather.temperature }}{{ city.weather.unit }}</span>
        <span class="weather-desc">{{ city.weather.description }}</span>
        <span class="weather-wind">风速 {{ city.weather.windSpeed }} km/h</span>
      </div>
      <p v-else class="weather-empty">天气暂不可用</p>
    </div>
  </div>
</template>

<style scoped>
.clock-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

/* HUD 科技感面板：深空底色 + 辉光数字，明暗主题下保持一致 */
.clock-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 22px 24px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 16px;
  background: #0b1220;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 18px 44px rgba(2, 8, 23, 0.35);
  overflow: hidden;
}

/* 网格扫描纹理 */
.clock-card::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  background-image:
    repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.04) 0 1px, transparent 1px 28px),
    repeating-linear-gradient(90deg, rgba(56, 189, 248, 0.04) 0 1px, transparent 1px 28px);
}

.corner {
  position: absolute;
  width: 14px;
  height: 14px;
  pointer-events: none;
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-top: 2px solid rgba(56, 189, 248, 0.6);
  border-left: 2px solid rgba(56, 189, 248, 0.6);
}

.corner-br {
  right: 10px;
  bottom: 10px;
  border-right: 2px solid rgba(56, 189, 248, 0.6);
  border-bottom: 2px solid rgba(56, 189, 248, 0.6);
}

.clock-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.clock-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 1.08rem;
  font-weight: 950;
  letter-spacing: 0.04em;
}

.clock-country {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.clock-time {
  margin-top: 14px;
  color: #38bdf8;
  font-family: 'Cascadia Code', 'JetBrains Mono', Consolas, monospace;
  font-size: clamp(1.9rem, 3.4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1;
  text-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
  font-variant-numeric: tabular-nums;
}

.clock-date {
  margin-top: 8px;
  color: #94a3b8;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.clock-tz {
  margin-top: 4px;
  color: #475569;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.weather-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px dashed rgba(148, 163, 184, 0.2);
}

.weather-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.weather-temp {
  color: #f1f5f9;
  font-size: 1.15rem;
  font-weight: 950;
  font-variant-numeric: tabular-nums;
}

.weather-desc {
  color: #94a3b8;
  font-size: 0.88rem;
  font-weight: 800;
}

.weather-wind {
  width: 100%;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 700;
}

.weather-empty {
  margin-top: auto;
  padding-top: 16px;
  color: #64748b;
  font-size: 0.84rem;
}

.clock-skeleton {
  min-height: 210px;
  border-radius: 16px;
  background: rgba(var(--brand-rgb), 0.08);
}

@media (max-width: 1100px) {
  .clock-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .clock-grid {
    grid-template-columns: 1fr;
  }
}
</style>
