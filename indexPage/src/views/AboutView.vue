<script setup>
import SectionHeading from '../components/SectionHeading.vue'
</script>

<template>
  <main class="page-view">
    <section class="content-panel" aria-labelledby="about-title">
      <SectionHeading
        variant="page"
        eyebrow="ABOUT THE PLATFORM"
        title="关于这个平台"
        title-id="about-title"
        lead="希燃呀开发者平台不是传统意义上的作品集，而是一个持续扩展的数字工作台：工具、报错解决方案、技术文章和工程实验都在这里汇合。"
      />

      <div class="about-layout">
        <article class="about-panel reveal reveal-2">
          <h2>探索底层逻辑，用代码重构世界。</h2>
          <p>
            这里面向开发者提供可运行的在线工具、可搜索的报错知识库、可复用的部署方案，以及围绕 AI、全栈和系统优化的实验项目。
          </p>
          <p>
            当你在 Nginx 配置、Spring Boot 部署、Vue 路由、Docker 构建或 AI 工作流中遇到问题时，可以先搜索错误、再使用对应工具验证、最后保存配置或收藏文章。
          </p>
          <div class="panel-actions">
            <a
              class="action primary"
              href="https://github.com/Xiranwuxianxi"
              target="_blank"
              rel="me noopener noreferrer"
            >
              关注 GitHub
            </a>
            <a
              class="action secondary"
              href="https://halo.xiranya.cn/"
              target="_blank"
              rel="noreferrer"
            >
              阅读博客
            </a>
          </div>
        </article>

        <div class="timeline" aria-label="平台建设节奏">
          <div class="timeline-item reveal reveal-2">
            <strong>Search</strong>
            <span>直接搜索完整错误信息，快速定位解决方案。</span>
          </div>
          <div class="timeline-item reveal reveal-3">
            <strong>Tool</strong>
            <span>使用在线工具生成配置、检查风险、验证片段。</span>
          </div>
          <div class="timeline-item reveal reveal-4">
            <strong>Save</strong>
            <span>登录后保存配置、收藏文章、管理个人工作台。</span>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>

<style scoped>
.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 16px;
  margin-top: 26px;
}

.about-panel {
  min-height: 340px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
}

.about-panel h2 {
  font-size: clamp(1.7rem, 4vw, 2.8rem);
  font-weight: 950;
  line-height: 1.1;
}

.about-panel p {
  margin-top: 16px;
  color: var(--muted);
  line-height: 1.85;
}

.timeline {
  display: grid;
  gap: 12px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--paper);
  transition:
    transform 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out),
    background 0.25s var(--ease-out);
}

.timeline-item:hover {
  transform: translateX(4px) scale(1.01);
  border-color: rgba(var(--brand-rgb), 0.22);
  background: rgba(255, 255, 255, 0.95);
  transition-timing-function: var(--ease-spring);
}

.timeline-item strong {
  color: var(--brand);
  font-weight: 950;
}

.timeline-item span {
  color: var(--muted);
  line-height: 1.7;
}

html.dark .timeline-item:hover {
  background: rgba(var(--brand-rgb), 0.08);
}

@media (max-width: 980px) {
  .about-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .timeline-item {
    grid-template-columns: 1fr;
  }
}
</style>
