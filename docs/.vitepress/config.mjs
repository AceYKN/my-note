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
  title: "Studiorum",
  description: "AceYKN 的学习笔记整理",
  lang: 'zh-CN', // 设置语言为中文
  lastUpdated: true, // 显示最后更新时间

  // 3. 主题配置
  themeConfig: {
    // ロゴと左上タイトル
    logo: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28"><text y="26" font-size="26" font-family="serif">栞</text></svg>' },
    siteTitle: 'Studiorum',
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '数学笔记', link: '/math/math' },
      { text: '編程開発', link: '/code/cpp-start' },
      { text: 'Computer Science', link: '/cs/' }
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
            buttonText: '検索',
            buttonAriaLabel: 'ドキュメントを検索'
          },
          modal: {
            displayDetails: '詳細リストを表示',
            resetButtonTitle: 'クエリをクリア',
            backButtonTitle: '戻る',
            noResultsText: '該当する結果が見つかりません',
            footer: {
              selectText: '選択',
              navigateText: '切替',
              closeText: '閉じる'
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
      message: '本サイトのコンテンツの一部はAIにより生成されています。内容の正確性についてはご自身でご確認ください。',
      copyright: 'CC0 1.0 パブリックドメイン — AceYKN は著作権を放棄します'
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
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: '我的知识库' }]
  ],

  // 7. 为每页自动注入 OG 标签
  transformHead({ pageData, siteData }) {
    const head = []
    const title = pageData.title || siteData.title
    const description = pageData.description || siteData.description
    const baseUrl = 'https://aceykn.github.io/my-note'
    const pageUrl = `${baseUrl}/${pageData.relativePath.replace(/(\.md)?$/, '.html').replace(/index\.html$/, '')}`

    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])

    if (description) {
      head.push(['meta', { name: 'description', content: description }])
      head.push(['meta', { property: 'og:description', content: description }])
    }

    // 如需自定义 OG 图片，可在 frontmatter 中设置 ogImage
    const ogImage = pageData.frontmatter.ogImage || `${baseUrl}/og-default.png`
    head.push(['meta', { property: 'og:image', content: ogImage }])

    return head
  }
})