<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  // 传入工具对象表示编辑，null 表示新增
  tool: {
    type: Object,
    default: null,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  name: '',
  slug: '',
  category: '',
  icon: '🔧',
  summary: '',
  description: '',
  status: 1,
})

const error = ref('')

watch(
  () => props.tool,
  (tool) => {
    if (tool) {
      form.name = tool.name || ''
      form.slug = tool.slug || ''
      form.category = tool.category || ''
      form.icon = tool.icon || '🔧'
      form.summary = tool.summary || ''
      form.description = tool.description || ''
      form.status = tool.publishStatus ?? 1
    }
    error.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.name.trim()) {
    error.value = '请填写工具名称'
    return
  }
  if (!form.slug.trim()) {
    error.value = '请填写 URL 别名（如 nginx-generator）'
    return
  }
  error.value = ''
  emit('save', { ...form, name: form.name.trim(), slug: form.slug.trim() })
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-mask" @click.self="emit('close')">
      <div class="modal-panel" role="dialog" aria-modal="true" :aria-label="tool ? '编辑工具' : '发布工具'">
      <h3 class="modal-title">{{ tool ? '编辑工具' : '发布新工具' }}</h3>

      <div class="form-grid">
        <label class="form-item">
          <span>名称 *</span>
          <input v-model="form.name" type="text" placeholder="如：Nginx 配置生成器" />
        </label>
        <label class="form-item">
          <span>URL 别名 *</span>
          <input v-model="form.slug" type="text" placeholder="如：nginx-generator" />
        </label>
        <label class="form-item">
          <span>分类</span>
          <input v-model="form.category" type="text" placeholder="如：部署 / 后端 / 安全 / SEO" />
        </label>
        <label class="form-item">
          <span>图标（emoji）</span>
          <input v-model="form.icon" type="text" maxlength="8" />
        </label>
        <label class="form-item form-item-full">
          <span>简介</span>
          <input v-model="form.summary" type="text" placeholder="一句话说明工具用途" />
        </label>
        <label class="form-item form-item-full">
          <span>详细介绍</span>
          <textarea v-model="form.description" rows="3" placeholder="可选" />
        </label>
        <label class="form-item">
          <span>状态</span>
          <select v-model.number="form.status">
            <option :value="1">发布</option>
            <option :value="2">草稿</option>
            <option :value="0">下线</option>
          </select>
        </label>
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn-ghost" :disabled="saving" @click="emit('close')">取消</button>
        <button type="button" class="btn-primary" :disabled="saving" @click="submit">
          {{ saving ? '保存中…' : tool ? '保存修改' : '发布工具' }}
        </button>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(2, 8, 23, 0.55);
  backdrop-filter: blur(4px);
}

.modal-panel {
  width: min(620px, 100%);
  max-height: 88vh;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  box-shadow: var(--shadow-hover);
  overflow-y: auto;
}

.modal-title {
  margin-bottom: 18px;
  font-size: 1.25rem;
  font-weight: 950;
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

.form-item input,
.form-item select,
.form-item textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
  background: var(--paper);
  font: inherit;
}

.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus {
  border-color: var(--line-strong);
  outline: none;
}

.form-error {
  margin-top: 14px;
  color: #e11d48;
  font-size: 0.86rem;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.btn-ghost,
.btn-primary {
  min-height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

.btn-ghost {
  border: 1px solid var(--line);
  color: var(--soft);
  background: transparent;
}

.btn-primary {
  border: 1px solid transparent;
  color: #fff;
  background: var(--brand);
  box-shadow: 0 10px 24px rgba(var(--brand-rgb), 0.25);
}

.btn-primary:hover:not(:disabled),
.btn-ghost:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-primary:disabled,
.btn-ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
