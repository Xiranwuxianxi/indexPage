<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  // 传入项目对象表示编辑，null 表示新增
  project: {
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
  type: '工具',
  projectStatus: 'online',
  demoUrl: '',
  cover: '',
  summary: '',
  description: '',
  techStack: '',
  repoUrl: '',
  icon: '⚡',
  status: 1,
})

const error = ref('')

watch(
  () => props.project,
  (project) => {
    if (project) {
      form.name = project.name || ''
      form.slug = project.slug || ''
      form.type = project.type || '工具'
      form.projectStatus = project.status || 'online'
      form.demoUrl = project.demoUrl || ''
      form.cover = project.cover || ''
      form.summary = project.summary || ''
      form.description = project.description || ''
      form.techStack = Array.isArray(project.techStack)
        ? project.techStack.join(', ')
        : project.techStack || ''
      form.repoUrl = project.repoUrl || ''
      form.icon = project.icon || '⚡'
      form.status = project.publishStatus ?? 1
    }
    error.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.name.trim()) {
    error.value = '请填写项目名称'
    return
  }
  if (!form.slug.trim()) {
    error.value = '请填写 URL 别名（如 csandbox）'
    return
  }
  if (!form.demoUrl.trim()) {
    error.value = '请填写项目网址'
    return
  }
  error.value = ''
  emit('save', {
    ...form,
    name: form.name.trim(),
    slug: form.slug.trim(),
    demoUrl: form.demoUrl.trim(),
  })
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-mask" @click.self="emit('close')">
      <div class="modal-panel" role="dialog" aria-modal="true" :aria-label="project ? '编辑项目' : '新增项目'">
      <h3 class="modal-title">{{ project ? '编辑项目' : '新增项目' }}</h3>

      <div class="form-grid">
        <label class="form-item">
          <span>项目名称 *</span>
          <input v-model="form.name" type="text" placeholder="如：C-Sandbox 在线编译" />
        </label>
        <label class="form-item">
          <span>URL 别名 *</span>
          <input v-model="form.slug" type="text" placeholder="如：csandbox" />
        </label>
        <label class="form-item">
          <span>类型</span>
          <input v-model="form.type" type="text" placeholder="如：工具 / 文章 / 日记" />
        </label>
        <label class="form-item">
          <span>项目状态</span>
          <select v-model="form.projectStatus">
            <option value="online">运行中</option>
            <option value="active">活跃</option>
            <option value="offline">已下线</option>
            <option value="archived">已归档</option>
          </select>
        </label>
        <label class="form-item form-item-full">
          <span>项目网址 *</span>
          <input v-model="form.demoUrl" type="url" placeholder="https://xiranya.cn/csandbox/" />
        </label>
        <label class="form-item form-item-full">
          <span>项目图像（封面 URL）</span>
          <input v-model="form.cover" type="url" placeholder="https://…/cover.png" />
        </label>
        <label class="form-item form-item-full">
          <span>项目简介</span>
          <input v-model="form.summary" type="text" placeholder="一句话介绍这个项目" />
        </label>
        <label class="form-item form-item-full">
          <span>详细介绍</span>
          <textarea v-model="form.description" rows="3" placeholder="可选" />
        </label>
        <label class="form-item">
          <span>技术栈（逗号分隔）</span>
          <input v-model="form.techStack" type="text" placeholder="Vue 3, Spring Boot" />
        </label>
        <label class="form-item">
          <span>仓库地址</span>
          <input v-model="form.repoUrl" type="url" placeholder="可选" />
        </label>
        <label class="form-item">
          <span>图标（emoji）</span>
          <input v-model="form.icon" type="text" maxlength="8" />
        </label>
        <label class="form-item">
          <span>发布状态</span>
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
          {{ saving ? '保存中…' : project ? '保存修改' : '添加项目' }}
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
  width: min(680px, 100%);
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
