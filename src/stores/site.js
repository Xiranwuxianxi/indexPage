import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  state: () => ({
    avatarUrl:
      'https://foruda.gitee.com/avatar/1742624335238297405/15477280_litinyana_1742624335.png',
    selectedType: '全部',
    signals: ['Compiler Lab', 'Diary Space', 'Open Source'],
    projects: [
      {
        id: 'csandbox',
        name: 'C-Sandbox 在线编译',
        href: 'http://xiranya.cn/csandbox/',
        type: '工具',
        status: 'Service Online',
        summary: '轻量级 C 语言在线编译环境，打开即写，适合快速验证想法、调试片段和记录实验结果。',
      },
      {
        id: 'diaries',
        name: '日记空间',
        href: 'http://xiranya.cn/diaries/',
        type: '日记',
        status: 'Diary Active',
        summary: '一个可以随手写日记、记录想法和沉淀生活片段的私人写作空间，把日常也纳入长期记录。',
      },
      {
        id: 'blog',
        name: '博客小栈',
        href: 'http://halo.xiranya.cn/',
        type: '文章',
        status: 'Blog Active',
        summary: '基于 Halo 构建的个人技术博客，记录编译器、前后端工程、系统优化和持续学习的过程。',
      },
      {
        id: 'gitee',
        name: 'Gitee 开源主页',
        href: 'https://gitee.com/litinyana',
        type: '源码',
        status: 'Open Source',
        summary: '开源仓库集合，沉淀项目实践、代码片段和工具原型，也欢迎 Star、Fork 与交流。',
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
      { value: '24h', label: '在线访问' },
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
