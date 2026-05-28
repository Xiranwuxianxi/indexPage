<template>
  <div class="app-container">
    <!-- 头像区域 -->
    <div class="avatar-section">
      <img :src="avatarUrl" alt="希燃呀的头像" class="avatar" @error="handleAvatarError" />
    </div>

    <!-- 核心展示区 -->
    <main class="hero">
      <h1>你好，我是希燃呀</h1>
      <p>探索底层逻辑，用代码重构世界。这里是我的数字研发试验场。</p>
    </main>

    <!-- 双列布局：左侧原项目 + 右侧模块（填满右侧） -->
    <div class="double-container">
      <!-- 左侧：原项目卡片 -->
      <section class="projects-container left">
        <!-- C-Sandbox 在线编译 -->
        <a
          href="http://xiranya.cn/csandbox/"
          target="_blank"
          class="project-card"
          rel="noopener noreferrer"
        >
          <h2>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
              />
            </svg>
            C-Sandbox 在线编译
          </h2>
          <p>
            我独立开发的轻量级 C 语言在线编译环境。秒级响应，打开即写，随时随地捕捉你的代码灵感。
          </p>
          <div class="status-badge">
            <div class="status-dot"></div>
            Service Online
          </div>
        </a>

        <!-- 博客小栈 - Halo 博客 -->
        <a
          href="http://halo.xiranya.cn/"
          target="_blank"
          class="project-card"
          rel="noopener noreferrer"
        >
          <h2>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4h16v2H4V4zm2 4h12v2H6V8zm14-6H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM6 12h12v2H6v-2zm0 4h8v2H6v-2z"
              />
            </svg>
            博客小栈
          </h2>
          <p>基于 Halo 构建的个人博客，记录技术思考、代码心得与生活点滴。沉淀思想，分享热爱。</p>
          <div class="status-badge">
            <div class="status-dot"></div>
            Blog Active
          </div>
        </a>

        <!-- Gitee 开源主页 -->
        <a
          href="https://gitee.com/litinyana"
          target="_blank"
          class="project-card"
          rel="noopener noreferrer"
        >
          <h2>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              />
            </svg>
            Gitee 开源主页
          </h2>
          <p>码云 Gitee 开源仓库集合，分享我的代码实践与开源项目。欢迎 Star 和 Fork！</p>
          <div class="status-badge">
            <div class="status-dot"></div>
            Open Source
          </div>
        </a>
      </section>

      <!-- 右侧：技术方向模块（不涉及隐私，填满右侧） -->
      <section class="info-container right">
        <div class="info-card">
          <h3>🚀 技术栈</h3>
          <p>• 全栈开发</p>
          <p>• 人工智能应用</p>
          <p>• 系统优化</p>
          <p>• 边缘智能</p>
        </div>
        <div class="info-card">
          <h3>💡 兴趣方向</h3>
          <p>• 编译器与解释器</p>
          <p>• 前端交互与可视化</p>
          <p>• 后端架构设计</p>
          <p>• 开源社区贡献</p>
        </div>
        <div class="info-card">
          <h3>📖 学习理念</h3>
          <p>• 知其然，更知其所以然</p>
          <p>• 用代码解决真实问题</p>
          <p>• 持续迭代，拥抱变化</p>
          <p>• 分享即是最好的学习</p>
        </div>
      </section>
    </div>

    <div class="coming-soon">🚀 更多硬核模块与奇思妙想正在孵化中，敬请期待...</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 头像 URL
const avatarUrl = ref(
  'https://foruda.gitee.com/avatar/1742624335238297405/15477280_litinyana_1742624335.png',
)

// 头像加载失败时的备用处理
const handleAvatarError = (event) => {
  event.target.style.opacity = '0'
  event.target.style.visibility = 'hidden'
}
</script>

<style scoped>
/* CSS 变量与重置 */
:root {
  --bg-color: #ffffff;
  --text-main: #1d1d1f;
  --text-muted: #86868b;
  --accent-color: #007aff;
  --accent-glow: rgba(0, 122, 255, 0.15);
  --card-bg: rgba(255, 255, 255, 0.7);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  background-color: var(--bg-color);
  color: var(--text-main);
  /* 科技感浅色网格背景 */
  background-image:
    linear-gradient(to right, #f2f2f7 1px, transparent 1px),
    linear-gradient(to bottom, #f2f2f7 1px, transparent 1px);
  background-size: 50px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  overflow-x: hidden;
  padding: 0 20px 50px;
}

/* 头像区域 */
.avatar-section {
  margin-top: 8vh;
  text-align: center;
  animation: fadeInDown 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  transform: translateY(-20px);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.2);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  background: #f5f5f7;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 28px rgba(0, 122, 255, 0.3);
}

/* 核心展示区 */
.hero {
  text-align: center;
  margin-top: 24px;
  padding: 0 20px;
  animation: fadeInDown 1s cubic-bezier(0.25, 0.8, 0.25, 1) 0.2s forwards;
  opacity: 0;
  transform: translateY(-20px);
}

.hero h1 {
  font-size: 4.5rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.05em;
  /* 科技感渐变文字 */
  background: linear-gradient(135deg, #007aff, #34c759);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-top: 20px;
  max-width: 600px;
  line-height: 1.6;
  font-weight: 400;
}

/* 双列布局容器 */
.double-container {
  width: 100%;
  max-width: 1200px;
  margin-top: 60px;
  display: flex;
  gap: 30px;
  animation: fadeInUp 1s cubic-bezier(0.25, 0.8, 0.25, 1) 0.4s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.left {
  flex: 1;
}

.right {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 项目卡片区 */
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.project-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 40px;
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.project-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 20px 50px var(--accent-glow);
  border-color: rgba(0, 122, 255, 0.3);
}

/* 卡片左侧的动态光条 */
.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #007aff, #5ac8fa);
  transition: width 0.3s ease;
}

.project-card:hover::before {
  width: 8px;
}

.project-card h2 {
  margin: 0 0 12px 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
}

.project-card h2 svg {
  width: 32px;
  height: 32px;
  fill: var(--accent-color);
}

.project-card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 1.15rem;
  line-height: 1.6;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 6px 14px;
  background-color: #f2f2f7;
  color: var(--accent-color);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #34c759;
  border-radius: 50%;
  box-shadow: 0 0 8px #34c759;
  animation: pulse 2s infinite;
}

/* 右侧信息卡片 */
.info-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
}

.info-card h3 {
  font-size: 1.2rem;
  margin-bottom: 14px;
  color: var(--accent-color);
}

.info-card p {
  font-size: 1rem;
  color: var(--text-main);
  line-height: 1.7;
  margin-bottom: 6px;
}

/* 正在建设中占位符 */
.coming-soon {
  margin-top: 30px;
  padding: 30px;
  border: 2px dashed #e5e5ea;
  border-radius: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 1.1rem;
  letter-spacing: 1px;
  width: 100%;
  max-width: 1200px;
  background: transparent;
  transition: background 0.3s ease;
}

.coming-soon:hover {
  background: #f8f8f9;
}

/* 动画定义 */
@keyframes fadeInDown {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(52, 199, 89, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);
  }
}

/* 移动端适配 */
@media (max-width: 900px) {
  .double-container {
    flex-direction: column;
  }
  .right {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .avatar {
    width: 90px;
    height: 90px;
  }

  .hero h1 {
    font-size: 3rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .project-card h2 {
    font-size: 1.6rem;
  }

  .project-card {
    padding: 30px 20px;
  }

  .project-card h2 svg {
    width: 28px;
    height: 28px;
  }
}
</style>
