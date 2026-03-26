import { defineConfig } from 'vitepress'
import markdownItMathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  // ==========================================
  // 1. 核心部署配置 (解决样式不显示的关键)
  // ==========================================
  base: '/my-note/',

  // sitemap 配置（有助于搜索引擎索引）
  sitemap: {
    hostname: 'https://aceykn.github.io/my-note/'
  },

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
      { text: 'Σ 数学笔记', link: '/math/math' },
      { text: '💻 编程开发', link: '/code/cpp-start' }
    ],

    // 侧边栏 (分级目录)
    sidebar: {
      // 当进入 /math/ 目录时显示
      '/math/': [
        {
          text: '抽象代数',
          collapsed: true, // 默认折叠
          items: [
            { text: '特殊类型的群 问题详解', link: '/math/abstract_algebra/groupproblem' },
            {
              text: '环的基本理论',
              link: '/math/abstract_algebra/ring'
            },
            { text: '环的基本理论 习题详解', link: '/math/abstract_algebra/ringHW' },
            { text: '子环、理想与商环', link: '/math/abstract_algebra/subringideal' },
            { text: '子环、理想与商环 习题详解', link: '/math/abstract_algebra/subringidealHW' },
            { text: '环同态基本定理', link: '/math/abstract_algebra/ringhomomorphism' },
            { text: '环同态基本定理 习题详解', link: '/math/abstract_algebra/ringhomomorphismHW' },
            { text: '环的直积与中国剩余定理', link: '/math/abstract_algebra/ringdirectprod' },
            { text: '环的直积与中国剩余定理 习题详解', link: '/math/abstract_algebra/ringdirectprodHW' },
            { text: '素理想与极大理想', link: '/math/abstract_algebra/primeandmaximalideal' },
            { text: '素理想与极大理想 习题详解', link: '/math/abstract_algebra/primeidealmaximalidealHW' }
          ]
        },
        {
          text: '数学分析',
          collapsed: true,
          items: [
            { text: 'Week 13 作业', link: '/math/math_analysis/Week13HW' },
            { text: '11-29 作业', link: '/math/math_analysis/11-29HW' },
            { text: '12-5 作业', link: '/math/math_analysis/12-5HW' },
            { text: '12-9 作业', link: '/math/math_analysis/12-9HW' }
          ]
        },
        {
          text: '常微分方程',
          collapsed: true,
          items: [
            { text: '题目内容', link: '/math/ode/prob' },
            { text: '3-2 4-1 作业', link: '/math/ode/3-2&4-1 HW' },
            { text: '4-2 作业', link: '/math/ode/4-2HW' },
            { text: '复习总结', link: '/math/ode/review' }
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
            { text: 'Golang', link: '/code/go-notes' },
            { text: 'vue', link: '/code/vue-notes' }
          ]
        }
      ]
    },

    // 开启本地搜索 (增强预览功能)
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: {
              title: 4,
              text: 2,
              titles: 1
            }
          }
        },
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '无法找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AceYKN/my-note' }
    ],

    // 文章大纲 (右侧目录)
    outline: {
      level: 'deep', // 显示 h2-h6
      label: 'On this page'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/AceYKN/my-note/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // 文档页脚 (上一篇/下一篇)
    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },

    // 页脚
    footer: {
      message: 'I laid my burdens down, now I\'m traveling light.',
      copyright: 'Copyright © 2026 AceYKN'
    }
  },

  // 4. Markdown 配置 (支持 LaTeX 公式)
  markdown: {
    lineNumbers: true, // 开启代码行号
    config: (md) => {
      md.use(markdownItMathjax3)
    },
    // 启用代码块复制按钮
    code: {
      lineNumbers: true
    }
  },

  // 5. Vite 配置（代码高亮主题）
  vite: {
    server: {
      host: '127.0.0.1',
      port: Number(process.env.PORT) || 4173
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    }
  },

  // 6. Head 配置 - 字体预加载和子集化
  head: [
    // 预加载关键字体（仅加载拉丁字符集）
    ['link', {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    }],
    ['link', {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap&subset=latin'
    }],
    // Favicon
    ['link', { rel: 'icon', href: '/my-note/favicon.ico' }],
    // Meta tags
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: '我的知识库' }]
  ]
})