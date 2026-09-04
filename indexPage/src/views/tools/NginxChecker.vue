<script setup>
import { computed, ref } from 'vue'

const input = ref('')

const rules = [
  {
    id: 'https-no-ssl',
    test: (c) => /listen\s+443(?!\s+ssl)/.test(c),
    level: 'error',
    message: 'listen 443 缺少 ssl 参数，HTTPS 端口将以明文 HTTP 响应',
  },
  {
    id: 'spa-no-tryfiles',
    test: (c) => /root\s+/.test(c) && !/try_files/.test(c),
    level: 'warn',
    message: '静态站点缺少 try_files 回退，History 路由刷新会 404',
  },
  {
    id: 'proxy-no-headers',
    test: (c) => /proxy_pass/.test(c) && !/proxy_set_header\s+Host/.test(c),
    level: 'warn',
    message: '反向代理缺少 proxy_set_header Host，后端可能拿到错误的 Host',
  },
  {
    id: 'proxy-no-forwarded',
    test: (c) => /proxy_pass/.test(c) && !/X-Forwarded-For/.test(c),
    level: 'warn',
    message: '缺少 X-Forwarded-For，后端无法获取真实客户端 IP',
  },
  {
    id: 'ws-no-upgrade',
    test: (c) => /proxy_pass/.test(c) && /socket|ws/i.test(c) && !/Upgrade/.test(c),
    level: 'error',
    message: '检测到 WebSocket 相关配置但缺少 Upgrade / Connection 头',
  },
  {
    id: 'no-body-size',
    test: (c) => /proxy_pass|root/.test(c) && !/client_max_body_size/.test(c),
    level: 'info',
    message: '未设置 client_max_body_size，默认 1m，大文件上传会 413',
  },
  {
    id: 'root-in-server',
    test: (c) => /server\s*\{[^}]*\broot\s+\/usr\/share\/nginx\/html/.test(c),
    level: 'info',
    message: 'root 指向 Nginx 默认目录，确认是否为预期站点目录',
  },
]

const issues = computed(() => {
  const config = input.value.trim()
  if (!config) return null
  const found = rules.filter((r) => r.test(config)).map((r) => ({ level: r.level, message: r.message }))
  return found
})
</script>

<template>
  <div class="tool-body">
    <label class="field-label" for="nginx-input">粘贴 Nginx 配置</label>
    <textarea
      id="nginx-input"
      v-model="input"
      class="field-textarea"
      rows="10"
      placeholder="server {&#10;    listen 80;&#10;    ...&#10;}"
    />

    <div v-if="issues" class="result">
      <p v-if="!issues.length" class="ok">✓ 未发现常见风险项</p>
      <ul v-else class="issue-list">
        <li v-for="(issue, i) in issues" :key="i" class="issue" :class="issue.level">
          <span class="badge">{{ { error: '严重', warn: '警告', info: '建议' }[issue.level] }}</span>
          {{ issue.message }}
        </li>
      </ul>
    </div>
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

.result {
  margin-top: 18px;
}

.ok {
  color: #17c784;
  font-weight: 800;
}

.issue-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.issue {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font-size: 0.9rem;
}

.badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 950;
}

.issue.error .badge {
  color: #fff;
  background: #e11d48;
}

.issue.warn .badge {
  color: #fff;
  background: #d97706;
}

.issue.info .badge {
  color: #fff;
  background: var(--brand);
}
</style>
