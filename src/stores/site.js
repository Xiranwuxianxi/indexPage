import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    avatarUrl: '/avatar.png',
    selectedType: '全部',
    signals: ['Compiler Lab', 'Diary Space', 'Open Source'],
    socialLinks: [
      {
        id: 'github',
        label: 'GitHub',
        handle: '@Xiranwuxianxi',
        href: 'https://github.com/Xiranwuxianxi',
        summary: '开源代码、项目仓库和工程实践都在这里。',
        tone: 'cyan',
      },
      {
        id: 'gitee',
        label: 'Gitee',
        handle: '@litinyana',
        href: 'https://gitee.com/litinyana',
        summary: 'Gitee 开源仓库集合，沉淀项目实践、代码片段和工具原型。',
        tone: 'green',
      },
      {
        id: 'bilibili',
        label: 'B 站',
        handle: '是希燃呀',
        href: 'https://space.bilibili.com/3494360370907205?spm_id_from=333.1007.0.0',
        summary: '视频内容、学习记录和更完整的表达。',
        tone: 'pink',
      },
      {
        id: 'douyin',
        label: '抖音',
        handle: '关注我的日常',
        href: 'https://www.douyin.com/user/MS4wLjABAAAAlQ6nUTklviASd3lZjc8bQC04lgBcw6YN0MYNxwmhhBVH4tUSZFcDc6cqxpSAupm8?from_tab_name=main',
        summary: '短视频、灵感片段和日常更新。',
        tone: 'gold',
      },
    ],
    projects: [
      {
        id: 'csandbox',
        name: 'C-Sandbox 在线编译',
        href: 'https://xiranya.cn/csandbox/',
        type: '工具',
        status: 'Service Online',
        icon: '⚡',
        tags: ['C', 'WebAssembly', 'Compiler'],
        summary: '轻量级 C 语言在线编译环境，打开即写，适合快速验证想法、调试片段和记录实验结果。',
      },
      {
        id: 'diaries',
        name: '日记空间',
        href: 'https://xiranya.cn/diaries/',
        type: '日记',
        status: 'Diary Active',
        icon: '📓',
        tags: ['Halo', 'Writing', 'Personal'],
        summary: '一个可以随手写日记、记录想法和沉淀生活片段的私人写作空间，把日常也纳入长期记录。',
      },
      {
        id: 'blog',
        name: '博客小栈',
        href: 'http://halo.xiranya.cn/',
        type: '文章',
        status: 'Blog Active',
        icon: '📚',
        tags: ['Halo', 'Java', 'Vue'],
        summary: '基于 Halo 构建的个人技术博客，记录编译器、前后端工程、系统优化和持续学习的过程。',
      },
    ],
    focusAreas: [
      {
        title: '核心方向',
        items: ['全栈开发', 'AI 应用', '系统优化', '边缘智能'],
      },
      {
        title: '兴趣支线',
        items: ['编译器与解释器', '前端交互', '后端架构', '开源协作'],
      },
      {
        title: '学习原则',
        items: ['追问原理', '解决真实问题', '持续迭代', '分享即学习'],
      },
    ],
    timeline: [
      {
        label: 'Build',
        text: '把工具、文章、日记和开源项目收束成可访问的数字入口。',
      },
      {
        label: 'Think',
        text: '围绕底层逻辑、工程实践、生活观察和系统设计持续记录。',
      },
      {
        label: 'Share',
        text: '用可运行的代码、可复盘的文章和可回看的日记，把成长过程沉淀下来。',
      },
    ],
    milestones: [
      { date: '2025 年春', title: '主页上线', text: 'Vue 3 + Vite 版本的个人数字主页首次部署。' },
      { date: '2025 年夏', title: 'SEO 增强', text: '引入路由级 SEO、结构化数据与构建后静态页生成。' },
      { date: '2026 年夏', title: '持续迭代', text: '组件化重构、深色模式与性能优化陆续落地。' },
    ],
  }),
  getters: {
    projectTypes: (state) => ['全部', ...new Set(state.projects.map((project) => project.type))],
    filteredProjects: (state) => {
      if (state.selectedType === '全部') {
        return state.projects
      }

      return state.projects.filter((project) => project.type === state.selectedType)
    },
    metrics: (state) => [
      { value: state.projects.length, label: '项目入口' },
      { value: state.socialLinks.length, label: '重点平台' },
      { value: '持续', label: '更新中' },
    ],
    featuredProject: (state) => state.projects[0],
  },
  actions: {
    setSelectedType(type) {
      this.selectedType = type
    },
  },
})
