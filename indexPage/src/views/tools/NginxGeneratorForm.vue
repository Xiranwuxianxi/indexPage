<script setup>
import { computed, reactive, ref } from 'vue'

const config = reactive({
  domain: 'example.com',
  https: true,
  forceHttps: true,
  root: '/var/www/html',
  historyMode: true,
  backend: 'http://localhost:8080',
  apiPrefix: '/api',
  preservePath: false,
  websocket: false,
  largeUpload: false,
  maxBodySize: 50,
  gzip: true,
  staticCache: true,
  securityHeaders: true,
})

const generated = computed(() => {
  const lines = []

  lines.push(`server {`)
  lines.push(`    listen 80;`)
  lines.push(`    server_name ${config.domain};`)

  if (config.https && config.forceHttps) {
    lines.push(`    return 301 https://$host$request_uri;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`server {`)
    lines.push(`    listen 443 ssl http2;`)
    lines.push(`    server_name ${config.domain};`)
    lines.push(`    ssl_certificate /path/to/cert.pem;`)
    lines.push(`    ssl_certificate_key /path/to/key.pem;`)
  }

  lines.push(`    root ${config.root};`)
  lines.push(`    index index.html;`)

  if (config.gzip) {
    lines.push(``)
    lines.push(`    gzip on;`)
    lines.push(`    gzip_vary on;`)
    lines.push(`    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;`)
  }

  if (config.largeUpload) {
    lines.push(``)
    lines.push(`    client_max_body_size ${config.maxBodySize}m;`)
  }

  if (config.securityHeaders) {
    lines.push(``)
    lines.push(`    add_header X-Frame-Options "SAMEORIGIN" always;`)
    lines.push(`    add_header X-Content-Type-Options "nosniff" always;`)
    lines.push(`    add_header Referrer-Policy "strict-origin-when-cross-origin" always;`)
  }

  if (config.staticCache) {
    lines.push(``)
    lines.push(`    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {`)
    lines.push(`        expires 1y;`)
    lines.push(`        add_header Cache-Control "public, immutable";`)
    lines.push(`    }`)
  }

  if (config.apiPrefix) {
    const proxyPath = config.preservePath ? config.apiPrefix : `${config.apiPrefix}/`
    lines.push(``)
    lines.push(`    location ${proxyPath} {`)
    lines.push(`        proxy_pass ${config.backend}${config.preservePath ? config.apiPrefix : '/'};`)
    lines.push(`        proxy_set_header Host $host;`)
    lines.push(`        proxy_set_header X-Real-IP $remote_addr;`)
    lines.push(`        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`)
    lines.push(`        proxy_set_header X-Forwarded-Proto $scheme;`)
    if (config.websocket) {
      lines.push(`        proxy_http_version 1.1;`)
      lines.push(`        proxy_set_header Upgrade $http_upgrade;`)
      lines.push(`        proxy_set_header Connection "upgrade";`)
    }
    lines.push(`    }`)
  }

  if (config.historyMode) {
    lines.push(``)
    lines.push(`    location / {`)
    lines.push(`        try_files $uri $uri/ /index.html;`)
    lines.push(`    }`)
  } else {
    lines.push(``)
    lines.push(`    location / {`)
    lines.push(`        try_files $uri $uri/ =404;`)
    lines.push(`    }`)
  }

  lines.push(`}`)

  return lines.join('\n')
})

const copied = ref(false)

const copyConfig = async () => {
  try {
    await navigator.clipboard.writeText(generated.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    copied.value = false
  }
}

const downloadConfig = () => {
  const blob = new Blob([generated.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.domain}.conf`
  a.click()
  URL.revokeObjectURL(url)
}

const optionHints = {
  domain: '服务器对外暴露的域名，例如 xiranya.cn。',
  https: '是否启用 HTTPS。生产环境建议始终开启。',
  forceHttps: '是否将 HTTP 请求 301 重定向到 HTTPS。',
  root: '前端静态资源在服务器上的部署目录。',
  historyMode: 'Vue Router 使用 history 模式时，需要 try_files 回退到 index.html。',
  backend: '后端 API 服务地址，例如 http://127.0.0.1:8080。',
  apiPrefix: '前端请求 API 的前缀，例如 /api。',
  preservePath: 'proxy_pass 是否保留原始路径，决定尾部斜杠行为。',
  websocket: '是否反向代理 WebSocket，需要额外 Upgrade/Connection 头。',
  largeUpload: '是否允许大文件上传，会设置 client_max_body_size。',
  maxBodySize: '允许上传的单个请求体最大大小，单位 MB。',
  gzip: '是否对文本资源启用 Gzip 压缩。',
  staticCache: '是否为静态资源设置长期缓存。',
  securityHeaders: '是否添加常用安全响应头。',
}
</script>

<template>
  <div class="generator-layout">
    <section class="generator-form" aria-labelledby="form-title">
      <h2 id="form-title" class="section-title">配置选项</h2>

      <div class="form-group">
        <label for="domain">域名</label>
        <input id="domain" v-model="config.domain" type="text" />
        <p class="hint">{{ optionHints.domain }}</p>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.https" type="checkbox" />
            启用 HTTPS
          </label>
          <p class="hint">{{ optionHints.https }}</p>
        </div>
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.forceHttps" type="checkbox" :disabled="!config.https" />
            强制 HTTPS
          </label>
          <p class="hint">{{ optionHints.forceHttps }}</p>
        </div>
      </div>

      <div class="form-group">
        <label for="root">前端部署目录</label>
        <input id="root" v-model="config.root" type="text" />
        <p class="hint">{{ optionHints.root }}</p>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.historyMode" type="checkbox" />
            Vue Router History 模式
          </label>
          <p class="hint">{{ optionHints.historyMode }}</p>
        </div>
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.gzip" type="checkbox" />
            启用 Gzip
          </label>
          <p class="hint">{{ optionHints.gzip }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="backend">后端服务地址</label>
          <input id="backend" v-model="config.backend" type="text" />
          <p class="hint">{{ optionHints.backend }}</p>
        </div>
        <div class="form-group">
          <label for="apiPrefix">API 前缀</label>
          <input id="apiPrefix" v-model="config.apiPrefix" type="text" />
          <p class="hint">{{ optionHints.apiPrefix }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.preservePath" type="checkbox" />
            保留原始路径
          </label>
          <p class="hint">{{ optionHints.preservePath }}</p>
        </div>
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.websocket" type="checkbox" />
            支持 WebSocket
          </label>
          <p class="hint">{{ optionHints.websocket }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.largeUpload" type="checkbox" />
            上传大文件
          </label>
          <p class="hint">{{ optionHints.largeUpload }}</p>
        </div>
        <div class="form-group">
          <label for="maxBodySize">最大上传大小（MB）</label>
          <input id="maxBodySize" v-model.number="config.maxBodySize" type="number" :disabled="!config.largeUpload" />
          <p class="hint">{{ optionHints.maxBodySize }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.staticCache" type="checkbox" />
            静态资源缓存
          </label>
          <p class="hint">{{ optionHints.staticCache }}</p>
        </div>
        <div class="form-group">
          <label class="checkbox">
            <input v-model="config.securityHeaders" type="checkbox" />
            安全响应头
          </label>
          <p class="hint">{{ optionHints.securityHeaders }}</p>
        </div>
      </div>
    </section>

    <section class="generator-preview" aria-labelledby="preview-title">
      <div class="preview-header">
        <h2 id="preview-title" class="section-title">实时预览</h2>
        <div class="preview-actions">
          <button type="button" class="action secondary" @click="copyConfig">
            {{ copied ? '已复制' : '复制' }}
          </button>
          <button type="button" class="action primary" @click="downloadConfig">下载 .conf</button>
        </div>
      </div>
      <pre class="config-output"><code>{{ generated }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.generator-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
  margin-top: 28px;
}

.generator-form,
.generator-preview {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.section-title {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 950;
}

.form-group {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--ink);
}

.form-group input[type='text'],
.form-group input[type='number'] {
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--ink);
  font-size: 0.95rem;
}

.form-group input:focus {
  outline: 3px solid rgba(0, 184, 255, 0.2);
  border-color: rgba(0, 184, 255, 0.4);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.hint {
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.6;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.config-output {
  min-height: 480px;
  max-height: 720px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--soft);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
}

html.dark .config-output {
  background: rgba(0, 0, 0, 0.25);
}

@media (max-width: 980px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
