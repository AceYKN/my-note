import { defineConfig } from 'vitepress'
import markdownItMathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  // ==========================================
  // 1. 核心部署配置 (解决样式不显示的关键)
  // ==========================================
  base: '/my-note/', 

  // 2. 网站基本元数据
  title: "我的知识库",
  description: "AceYKN 的学习笔记整理",
  lang: 'zh-CN', // 设置语言为中文
  lastUpdated: true, // 显示最后更新时间

  // 3. 主题配置
  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: 'Σ 数学笔记', link: '/math/calculus' },
      { text: '💻 编程开发', link: '/code/cpp-start' }
    ],

    // 侧边栏 (分级目录)
    sidebar: {
      // 当进入 /math/ 目录时显示
      '/math/': [
        { text: '抽象代数', link: '/math/algebra' } ,
        {
          text: '常微分方程',
          collapsed: true, // 這門課暫時不看，預設折疊
          items: [
            { text: '3-2 4-1 作业', link: '/math/ode/3-2&4-1 HW' },
            { text: '4-2 作业', link: '/math/ode/4-2HW' }
          ]
        }
          
      ],

      // 当进入 /code/ 目录时显示
      '/code/': [
        {
          text: 'C/C++ 语言',
          items: [
            { text: '入门基础', link: '/code/cpp-start' }
          ]
        },
        {
          text: '其他技术',
          items: [
            { text: 'Go 语言', link: '/code/go-notes' },
            { text: '前端开发', link: '/code/vue-notes' }
          ]
        }
      ]
    },

    // 开启本地搜索 (非常实用！)
    search: {
      provider: 'local'
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AceYKN/my-note' }
    ],

    // 文章大纲 (右侧目录)
    outline: {
      level: 'deep', // 显示 h2-h6
      label: '页面导航'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/AceYKN/my-note/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 文档页脚 (上一篇/下一篇)
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 页脚
    footer: {
      message: 'I laid my burdens down, now I\'m traveling light.',
      copyright: 'Copyright © 2025 AceYKN'
    }
  },

  // 4. Markdown 配置 (支持 LaTeX 公式)
  markdown: {
    lineNumbers: true, // 开启代码行号
    config: (md) => {
      md.use(markdownItMathjax3)
    }
  }
})