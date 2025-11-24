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
        {
          text: '基础课程',
          collapsed: false,
          items: [
            { text: '微积分', link: '/math/calculus' },
            // 如果以后有文件了，解开下面这行的注释
            // { text: '线性代数', link: '/math/linear-algebra' }
          ]
        },
        {
          text: '专业进阶',
          collapsed: false,
          items: [
            // 预留给你感兴趣的科目
            { text: '常微分方程 (ODE)', link: '/math/ode' },
            { text: '抽象代数', link: '/math/algebra' } 
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

    // 页脚
    footer: {
      message: '学而不思则罔，思而不学则殆',
      copyright: 'Copyright © 2025 AceYKN'
    }
  },

  // 4. Markdown 配置 (支持 LaTeX 公式)
  markdown: {
    config: (md) => {
      md.use(markdownItMathjax3)
    }
  }
})