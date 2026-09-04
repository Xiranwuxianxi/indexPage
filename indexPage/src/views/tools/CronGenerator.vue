<script setup>
import { computed, reactive } from 'vue'

const fieldOptions = {
  minute: ['*', '0', '*/5', '*/15', '*/30', '0,30'],
  hour: ['*', '0', '*/2', '*/6', '9-18', '8,12,18'],
  day: ['*', '1', '*/2', '1,15', 'L'],
  month: ['*', '1', '*/3', '1,7'],
  week: ['*', '1', '1-5', '6,0'],
}

const labels = {
  minute: '分钟',
  hour: '小时',
  day: '日',
  month: '月',
  week: '星期',
}

const form = reactive({
  minute: '0',
  hour: '9',
  day: '*',
  month: '*',
  week: '*',
})

const expression = computed(() =>
  [form.minute, form.hour, form.day, form.month, form.week].join(' '),
)

const description = computed(() => {
  const parts = []
  parts.push(form.minute === '*' ? '每分钟' : `第 ${form.minute} 分钟`)
  parts.push(form.hour === '*' ? '每小时' : `第 ${form.hour} 小时`)
  if (form.day !== '*') parts.push(`每月 ${form.day} 日`)
  if (form.month !== '*') parts.push(`月份 ${form.month}`)
  if (form.week !== '*') parts.push(`星期 ${form.week}`)
  return parts.join('，')
})
</script>

<template>
  <div class="tool-body">
    <div class="cron-grid">
      <label v-for="(options, key) in fieldOptions" :key="key" class="cron-field">
        <span>{{ labels[key] }}</span>
        <select v-model="form[key]">
          <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
    </div>

    <div class="cron-result">
      <p class="cron-expression">{{ expression }}</p>
      <p class="cron-desc">{{ description }}</p>
      <p class="cron-note">标准 5 段 Cron（分 时 日 月 周），适用于 Linux crontab / Nginx 计划任务等。</p>
    </div>
  </div>
</template>

<style scoped>
.tool-body {
  margin-top: 24px;
}

.cron-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.cron-field {
  display: grid;
  gap: 6px;
}

.cron-field span {
  color: var(--soft);
  font-size: 0.84rem;
  font-weight: 800;
}

.cron-field select {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
}

.cron-result {
  margin-top: 22px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(var(--brand-rgb), 0.05);
  text-align: center;
}

.cron-expression {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--brand);
}

.cron-desc {
  margin-top: 10px;
  color: var(--ink);
  font-weight: 700;
}

.cron-note {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.82rem;
}

@media (max-width: 640px) {
  .cron-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
