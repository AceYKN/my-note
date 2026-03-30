import { defineConfig } from 'vitepress'
import { katex } from '@mdit/plugin-katex'
import { generateSidebar } from './sidebar.mjs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '..')

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
      { text: '首页', link: '/' },
      { text: '数学笔记', link: '/math/math' },
      { text: '编程开发', link: '/code/cpp-start' },
      { text: '操作系统', link: '/cs/os/' }
    ],

    // 侧边栏 — 从文件系统自动生成，无需手动维护
    sidebar: generateSidebar(docsDir),

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
      md.use(katex)

      // 构建时直接把 <table> 包裹在 <div class="table-container"> 中，零客户端开销
      md.renderer.rules.table_open = function(tokens, idx, options, env, self) {
        return '<div class="table-container">' + self.renderToken(tokens, idx, options)
      }
      md.renderer.rules.table_close = function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options) + '</div>'
      }
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
      href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap'
    }],
    // KaTeX 样式
    ['link', {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.44/dist/katex.min.css'
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