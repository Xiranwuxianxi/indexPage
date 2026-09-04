<script setup>
import { computed, reactive, ref } from 'vue'

const config = reactive({
  origins: 'https://xiranya.cn',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  headers: 'Content-Type, Authorization',
  credentials: true,
  maxAge: 3600,
})

const tab = ref('spring')

const springCode = computed(
  () => `@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("${config.origins}")
                        .allowedMethods(${config.methods
                          .split(',')
                          .map((m) => '"' + m.trim() + '"')
                          .join(', ')})
                        .allowedHeaders(${config.headers
                          .split(',')
                          .map((h) => '"' + h.trim() + '"')
                          .join(', ')})
                        .allowCredentials(${config.credentials})
                        .maxAge(${config.maxAge});
            }
        };
    }
}`,
)

const nginxCode = computed(
  () => `location /api/ {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '${config.origins}';
        add_header 'Access-Control-Allow-Methods' '${config.methods}';
        add_header 'Access-Control-Allow-Headers' '${config.headers}';
        add_header 'Access-Control-Max-Age' ${config.maxAge};
        return 204;
    }
    add_header 'Access-Control-Allow-Origin' '${config.origins}' always;${config.credentials ? `
    add_header 'Access-Control-Allow-Credentials' 'true' always;` : ''}
    proxy_pass http://127.0.0.1:8080/;
}`,
)

const nodeCode = computed(
  () => `const cors = require('cors');

app.use(cors({
  origin: ${JSON.stringify(config.origins.split(',').map((o) => o.trim()))},
  methods: ${JSON.stringify(config.methods.split(',').map((m) => m.trim()))},
  allowedHeaders: ${JSON.stringify(config.headers.split(',').map((h) => h.trim()))},
  credentials: ${config.credentials},
  maxAge: ${config.maxAge},
}));`,
)

const outputs = computed(() => ({
  spring: springCode.value,
  nginx: nginxCode.value,
  node: nodeCode.value,
}))

const copied = ref(false)

async function copyResult() {
  try {
    await navigator.clipboard.writeText(outputs.value[tab.value])
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="tool-body">
    <div class="form-grid">
      <label class="form-item form-item-full">
        <span>允许的源（多个用逗号分隔）</span>
        <input v-model="config.origins" type="text" />
      </label>
      <label class="form-item">
        <span>允许的方法</span>
        <input v-model="config.methods" type="text" />
      </label>
      <label class="form-item">
        <span>允许的请求头</span>
        <input v-model="config.headers" type="text" />
      </label>
      <label class="form-item">
        <span>预检缓存（秒）</span>
        <input v-model.number="config.maxAge" type="number" min="0" />
      </label>
      <label class="form-item form-item-check">
        <input v-model="config.credentials" type="checkbox" />
        <span>允许携带凭证（Cookie / Authorization）</span>
      </label>
    </div>

    <div class="tabs">
      <button
        v-for="t in [['spring', 'Spring Boot'], ['nginx', 'Nginx'], ['node', 'Node.js']]"
        :key="t[0]"
        type="button"
        class="tab"
        :class="{ active: tab === t[0] }"
        @click="tab = t[0]"
      >
        {{ t[1] }}
      </button>
      <button type="button" class="copy-btn" @click="copyResult">
        {{ copied ? '已复制 ✓' : '复制配置' }}
      </button>
    </div>

    <pre class="code-output">{{ outputs[tab] }}</pre>
  </div>
</template>

<style scoped>
.tool-body {
  margin-top: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-item {
  display: grid;
  gap: 6px;
}

.form-item-full {
  grid-column: 1 / -1;
}

.form-item span {
  color: var(--soft);
  font-size: 0.84rem;
  font-weight: 800;
}

.form-item input[type='text'],
.form-item input[type='number'] {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
}

.form-item-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.tab,
.copy-btn {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--muted);
  background: var(--paper);
  font-weight: 800;
  cursor: pointer;
}

.tab.active {
  color: #fff;
  border-color: transparent;
  background: var(--brand);
}

.copy-btn {
  margin-left: auto;
  color: var(--brand);
  border-color: var(--line-strong);
}

.code-output {
  margin: 14px 0 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--ink);
  background: rgba(var(--brand-rgb), 0.05);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.82rem;
  line-height: 1.7;
  overflow-x: auto;
  white-space: pre;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
