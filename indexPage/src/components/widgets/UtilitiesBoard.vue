<script setup>
/* global TextEncoder, TextDecoder, btoa, atob, crypto */
import { ref } from 'vue'

defineProps({
  utilities: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const activeKey = ref(null)

// ---------- 时间戳转换 ----------
const tsInput = ref('')
const tsResult = ref('')

function convertTimestamp() {
  const raw = tsInput.value.trim()
  if (!raw) {
    tsResult.value = ''
    return
  }
  const num = Number(raw)
  if (Number.isNaN(num)) {
    tsResult.value = '请输入有效的时间戳（秒或毫秒）'
    return
  }
  const ms = Math.abs(num) < 1e12 ? num * 1000 : num
  const d = new Date(ms)
  tsResult.value = Number.isNaN(d.getTime())
    ? '无效的时间戳'
    : `${d.toLocaleString('zh-CN', { hour12: false })}（${d.toString()}）`
}

// ---------- Base64 编解码 ----------
const b64Input = ref('')
const b64Result = ref('')
const b64Mode = ref('encode')

function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach((b) => {
    bin += String.fromCharCode(b)
  })
  return btoa(bin)
}

function fromBase64(b64) {
  const bin = atob(b64.trim())
  const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)))
  return new TextDecoder().decode(bytes)
}

function runBase64() {
  try {
    b64Result.value = b64Mode.value === 'encode' ? toBase64(b64Input.value) : fromBase64(b64Input.value)
  } catch {
    b64Result.value = '转换失败，请检查输入内容'
  }
}

// ---------- JSON 格式化 ----------
const jsonInput = ref('')
const jsonResult = ref('')
const jsonError = ref('')

function formatJson() {
  try {
    jsonResult.value = JSON.stringify(JSON.parse(jsonInput.value), null, 2)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = `JSON 格式错误：${e.message}`
  }
}

// ---------- 随机密码 ----------
const passwordLength = ref(16)
const passwordResult = ref('')

function generatePassword() {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+[]{};:,.?'
  const len = Math.max(6, Math.min(64, passwordLength.value))
  const arr = new Uint32Array(len)
  crypto.getRandomValues(arr)
  passwordResult.value = Array.from(arr, (n) => chars[n % chars.length]).join('')
}

// ---------- 颜色转换 ----------
const colorInput = ref('#6366f1')
const colorResult = ref('')

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(h)) return null
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function convertColor() {
  const rgb = hexToRgb(colorInput.value)
  if (!rgb) {
    colorResult.value = '请输入有效的 HEX 颜色，如 #6366f1'
    return
  }
  const { r, g, b } = rgb
  const hslR = r / 255
  const hslG = g / 255
  const hslB = b / 255
  const max = Math.max(hslR, hslG, hslB)
  const min = Math.min(hslR, hslG, hslB)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case hslR:
        h = ((hslG - hslB) / d + (hslG < hslB ? 6 : 0)) * 60
        break
      case hslG:
        h = ((hslB - hslR) / d + 2) * 60
        break
      default:
        h = ((hslR - hslG) / d + 4) * 60
    }
  }
  colorResult.value = `rgb(${r}, ${g}, ${b})\nHSL(${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}
</script>

<template>
  <div v-if="loading" class="utility-grid">
    <div v-for="i in 5" :key="i" class="utility-skeleton" />
  </div>
  <div v-else class="utility-board">
    <div class="utility-grid">
      <button
        v-for="util in utilities"
        :key="util.key"
        type="button"
        class="utility-card"
        :class="{ active: activeKey === util.key }"
        @click="activeKey = activeKey === util.key ? null : util.key"
      >
        <span class="utility-icon" aria-hidden="true">{{ util.icon }}</span>
        <span class="utility-name">{{ util.name }}</span>
        <span class="utility-desc">{{ util.description }}</span>
      </button>
    </div>

    <div v-if="activeKey === 'timestamp'" class="utility-panel">
      <label class="field-label" for="ts-input">Unix 时间戳（秒或毫秒）</label>
      <div class="field-row">
        <input id="ts-input" v-model="tsInput" class="field-input" placeholder="如 1785481200" />
        <button type="button" class="field-button" @click="convertTimestamp">转换</button>
      </div>
      <pre v-if="tsResult" class="field-result">{{ tsResult }}</pre>
    </div>

    <div v-else-if="activeKey === 'base64'" class="utility-panel">
      <label class="field-label" for="b64-input">待转换文本</label>
      <div class="field-row">
        <select v-model="b64Mode" class="field-select" aria-label="转换方向">
          <option value="encode">编码为 Base64</option>
          <option value="decode">从 Base64 解码</option>
        </select>
        <input id="b64-input" v-model="b64Input" class="field-input" placeholder="输入内容" />
        <button type="button" class="field-button" @click="runBase64">转换</button>
      </div>
      <pre v-if="b64Result" class="field-result">{{ b64Result }}</pre>
    </div>

    <div v-else-if="activeKey === 'json'" class="utility-panel">
      <label class="field-label" for="json-input">粘贴压缩 JSON</label>
      <textarea
        id="json-input"
        v-model="jsonInput"
        class="field-textarea"
        rows="5"
        placeholder="{&quot;hello&quot;:&quot;world&quot;}"
      />
      <button type="button" class="field-button" @click="formatJson">格式化</button>
      <p v-if="jsonError" class="field-error">{{ jsonError }}</p>
      <pre v-if="jsonResult" class="field-result">{{ jsonResult }}</pre>
    </div>

    <div v-else-if="activeKey === 'password'" class="utility-panel">
      <label class="field-label" for="password-length">密码长度（6 - 64）</label>
      <div class="field-row">
        <input
          id="password-length"
          v-model.number="passwordLength"
          type="number"
          min="6"
          max="64"
          class="field-input"
        />
        <button type="button" class="field-button" @click="generatePassword">生成</button>
      </div>
      <pre v-if="passwordResult" class="field-result">{{ passwordResult }}</pre>
    </div>

    <div v-else-if="activeKey === 'color'" class="utility-panel">
      <label class="field-label" for="color-input">HEX 颜色值</label>
      <div class="field-row">
        <input
          id="color-input"
          v-model="colorInput"
          class="field-input"
          placeholder="#6366f1"
        />
        <input type="color" class="field-color" :value="colorInput" @input="colorInput = $event.target.value" />
        <button type="button" class="field-button" @click="convertColor">转换</button>
      </div>
      <pre v-if="colorResult" class="field-result">{{ colorResult }}</pre>
    </div>
  </div>
</template>

<style scoped>
.utility-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.utility-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: var(--ink);
  background: var(--paper);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out);
}

.utility-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-hover);
}

.utility-card.active {
  border-color: var(--cyan);
  box-shadow: 0 0 0 2px rgba(var(--brand-rgb), 0.15), var(--shadow);
}

.utility-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(var(--brand-rgb), 0.08);
  font-size: 1.3rem;
  line-height: 1;
}

.utility-name {
  font-size: 1.05rem;
  font-weight: 950;
}

.utility-desc {
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.6;
}

.utility-panel {
  margin-top: 18px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
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

.field-input,
.field-select {
  flex: 1 1 220px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
}

.field-textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.86rem;
  resize: vertical;
}

.field-color {
  width: 48px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--paper);
  cursor: pointer;
}

.field-button {
  min-height: 40px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #fff;
  background: var(--cyan);
  font-weight: 950;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.field-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(var(--brand-rgb), 0.25);
}

.field-result {
  margin-top: 14px;
  padding: 14px;
  border-radius: 10px;
  color: var(--ink);
  background: rgba(var(--brand-rgb), 0.06);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.86rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.field-error {
  margin-top: 12px;
  color: #c0392b;
  font-size: 0.86rem;
  font-weight: 700;
}

.utility-skeleton {
  min-height: 150px;
  border-radius: 14px;
  background: rgba(var(--brand-rgb), 0.06);
  animation: utility-pulse 1.5s ease-in-out infinite;
}

@keyframes utility-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@media (max-width: 1100px) {
  .utility-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .utility-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
