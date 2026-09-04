<script setup>
import { ref } from 'vue'

import api from '../../api/client.js'

const url = ref('https://xiranya.cn/sitemap.xml')
const loading = ref(false)
const result = ref(null)
const error = ref(null)

async function check() {
  if (!url.value.trim()) {
    error.value = '请输入 sitemap 地址'
    return
  }
  loading.value = true
  error.value = null
  result.value = null
  try {
    result.value = await api.execTool('sitemap-checker', { url: url.value.trim() })
  } catch (err) {
    error.value = err.message || '检查失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="tool-body">
    <label class="field-label" for="sitemap-input">Sitemap 地址</label>
    <div class="field-row">
      <input id="sitemap-input" v-model="url" class="field-input" type="url" />
      <button type="button" class="field-button" :disabled="loading" @click="check">
        {{ loading ? '检查中…' : '开始检查' }}
      </button>
    </div>

    <p v-if="error" class="field-error">{{ error }}</p>

    <div v-if="result" class="result" :class="{ fail: !result.success }">
      <span class="result-icon">{{ result.success ? '✓' : '✗' }}</span>
      <span>{{ result.output }}</span>
    </div>
    <p class="note">检查由服务端发起请求，可绕过浏览器跨域限制。</p>
  </div>
</template>

<style scoped>
.tool-body {
  margin-top: 24px;
}

.field-label {
  display: block;
  margin-bottom: 10px;
  color: var(--soft);
  font-size: 0.86rem;
  font-weight: 800;
}

.field-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.field-input {
  flex: 1 1 260px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
}

.field-button {
  min-height: 42px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #fff;
  background: var(--brand);
  font-weight: 950;
  cursor: pointer;
}

.field-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-error {
  margin-top: 12px;
  color: #e11d48;
  font-size: 0.86rem;
  font-weight: 700;
}

.result {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid rgba(23, 199, 132, 0.35);
  border-radius: 10px;
  color: var(--ink);
  background: rgba(23, 199, 132, 0.08);
  font-size: 0.92rem;
}

.result.fail {
  border-color: rgba(225, 29, 72, 0.35);
  background: rgba(225, 29, 72, 0.07);
}

.result-icon {
  font-weight: 950;
  color: #17c784;
}

.result.fail .result-icon {
  color: #e11d48;
}

.note {
  margin-top: 12px;
  color: var(--muted);
  font-size: 0.8rem;
}
</style>
