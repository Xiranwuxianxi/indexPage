<script setup>
import { computed, ref } from 'vue'

const input = ref('')
const error = ref('')

function decodePart(part) {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const bin = atob(padded)
  const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)))
  return JSON.parse(new TextDecoder().decode(bytes))
}

const decoded = computed(() => {
  error.value = ''
  const token = input.value.trim()
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) {
    error.value = 'JWT 应由三段组成（Header.Payload.Signature）'
    return null
  }
  try {
    const header = decodePart(parts[0])
    const payload = decodePart(parts[1])
    return { header, payload, signature: parts[2] }
  } catch {
    error.value = '解码失败，请检查 Token 是否完整'
    return null
  }
})

function fmtTime(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleString('zh-CN', { hour12: false })
}

const expiry = computed(() => {
  if (!decoded.value?.payload?.exp) return null
  const exp = decoded.value.payload.exp * 1000
  return {
    text: fmtTime(decoded.value.payload.exp),
    expired: exp < Date.now(),
  }
})
</script>

<template>
  <div class="tool-body">
    <label class="field-label" for="jwt-input">粘贴 JWT Token</label>
    <textarea
      id="jwt-input"
      v-model="input"
      class="field-textarea"
      rows="4"
      placeholder="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.xxxx"
    />

    <p v-if="error" class="field-error">{{ error }}</p>

    <template v-if="decoded">
      <div class="result-grid">
        <div class="result-block">
          <h4>Header</h4>
          <pre>{{ JSON.stringify(decoded.header, null, 2) }}</pre>
        </div>
        <div class="result-block">
          <h4>Payload</h4>
          <pre>{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
        </div>
      </div>
      <p v-if="expiry" class="expiry" :class="{ expired: expiry.expired }">
        {{ expiry.expired ? '已过期' : '有效期至' }}：{{ expiry.text }}
      </p>
      <p class="note">提示：解析完全在浏览器本地进行，Token 不会上传到服务器。</p>
    </template>
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

.field-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.85rem;
  resize: vertical;
}

.field-error {
  margin-top: 12px;
  color: #e11d48;
  font-size: 0.86rem;
  font-weight: 700;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.result-block h4 {
  margin: 0 0 8px;
  font-size: 0.9rem;
  font-weight: 950;
}

.result-block pre {
  margin: 0;
  padding: 14px;
  border-radius: 10px;
  color: var(--ink);
  background: rgba(var(--brand-rgb), 0.06);
  font-size: 0.8rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.expiry {
  margin-top: 14px;
  color: #17c784;
  font-weight: 800;
}

.expiry.expired {
  color: #e11d48;
}

.note {
  margin-top: 12px;
  color: var(--muted);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
