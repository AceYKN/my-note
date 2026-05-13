import { defineConfig } from 'vitepress'
import { katex } from '@mdit/plugin-katex'
import { generateSidebar } from './sidebar.mjs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '..')

// 全局 CJK 字体风格：'TC'（思源繁体）或 'JP'（思源日文）
const CJK_FONT_VARIANT = 'JP'
const CJK_FONT_PRIMARY = CJK_FONT_VARIANT === 'JP' ? 'Noto+Serif+JP' : 'Noto+Serif+TC'
const CJK_FONT_FALLBACK = 'Noto+Serif+SC'

/** Vite 插件：监听 .md 文件新增/删除，自动重启 dev server 以更新侧边栏 */
function sidebarWatcherPlugin() {
  return {
    name: 'sidebar-watcher',
    configureServer(server) {
      // 监听 docs 目录下所有 .md 文件的新增和删除
      server.watcher.add(path.join(docsDir, '**/*.md'))
      server.watcher.on('add', (file) => {
        if (file.endsWith('.md')) {
          console.log(`[sidebar-watcher] New file detected: ${file}, restarting...`)
          server.restart()
        }
      })
      server.watcher.on('unlink', (file) => {
        if (file.endsWith('.md')) {
          console.log(`[sidebar-watcher] File removed: ${file}, restarting...`)
          server.restart()
        }
      })
    }
  }
}

export default defineConfig({
  // ==========================================
  // 1. 核心部署配置 (解决样式不显示的关键)
  // ==========================================
  base: '/my-note/',

  // sitemap 配置（有助于搜索引擎索引）
  sitemap: {
    hostname: 'https://aceykn.github.io/my-note/',
    lastmod: true,
    changefreq: 'weekly',
    transformItems: (items) =>
      items
        .filter((item) => !item.url.includes('404'))
        .map((item) => {
          const url = item.url
          // 首页与各科目入口页最高优先级
          const isRoot = url === '' || url === 'index.html'
          const isIndex = url.endsWith('/') || url.endsWith('index.html')
          // 高价值复习/总结页
          const isHighValue = /\/(review|prob|Def|fill-in-the-blanks|mcq|shortans|TorF)/.test(url)
          // 计算路径深度
          const depth = url.split('/').length

          let priority
          if (isRoot) {
            priority = 1.0
          } else if (isIndex && depth <= 3) {
            priority = 0.9
          } else if (isHighValue) {
            priority = 0.85
          } else if (depth <= 3) {
            priority = 0.8
          } else {
            priority = 0.6
          }

          return { ...item, priority }
        })
  },

  // 2. 网站基本元数据
  title: 'Studiorum',
  description:
    'AceYKN 的学习笔记整理 — 数学、计算机科学、软件工程课程笔记、习题与过去问汇总。Studiorum by AceYKN.',
  lang: 'zh-CN',
  lastUpdated: true, // 显示最后更新时间

  // 3. 主题配置
  themeConfig: {
    sidebarMenuLabel: 'メニュー',
    // ロゴと左上タイトル
    siteTitle: 'Studiorum',
    logo: '/logo.svg',
    // 顶部导航栏
    nav: [
      { text: '數學', link: '/math/math' },
      { text: '開発', link: '/code/cpp-start' },
      { text: '電腦', link: '/cs/' },
      { text: '言語', link: '/language/' }
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
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '未找到相关结果',
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/AceYKN/my-note' }],

    // 文章大纲 (右侧目录)
    outline: {
      level: 'deep', // 显示 h2-h6
      label: '目次'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/AceYKN/my-note/edit/main/docs/:path',
      text: 'GitHub で編集'
    },

    // 文档页脚 (上一篇/下一篇)
    docFooter: {
      prev: '← Prev',
      next: 'Next →'
    },

    // 頁腳
    footer: {
      message: '本站所載，間有由 AI 所生成者。其辭義真偽，請君自審之。',
      copyright: 'CC0 1.0 公有領域 — 盡捐著作權'
    }
  },

  // 4. Markdown 配置 (支持 LaTeX 公式)
  markdown: {
    lineNumbers: true, // 开启代码行号
    config: (md) => {
      md.use(katex)

      // 构建时直接把 <table> 包裹在 <div class="table-container"> 中，零客户端开销
      md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
        return '<div class="table-container">' + self.renderToken(tokens, idx, options)
      }
      md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
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
    plugins: [sidebarWatcherPlugin()],
    ssr: {
      noExternal: ['mark.js']
    },
    server: {
      host: '127.0.0.1'
    },
    build: {
      chunkSizeWarningLimit: 1000
    }
  },

  // 6. Head 配置 - 字体预加载和子集化
  head: [
    // 预加载关键字体（仅加载拉丁字符集）
    [
      'link',
      {
        rel: 'dns-prefetch',
        href: 'https://fonts.googleapis.com'
      }
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      }
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: ''
      }
    ],
    // 古典 mode: IBM Plex Serif（英文正文）+ Crimson Pro（英文标题）
    // 通用: Inter + 思源字形（主字形 + SC 补字）
    [
      'link',
      {
        rel: 'stylesheet',
        href: `https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:opsz,wght@14..32,400;14..32,600&family=Noto+Sans+TC:wght@400;600&family=Noto+Sans+SC:wght@400;600&family=${CJK_FONT_PRIMARY}:wght@400;600&family=${CJK_FONT_FALLBACK}:wght@400;600&display=swap`
      }
    ],
    // Favicon
    ['link', { rel: 'icon', href: '/my-note/logo.svg' }],
    // Meta tags — 分别为浅色/深色模式提供 theme-color，防止手机浏览器工具栏颜色异常
    ['meta', { name: 'theme-color', content: '#eef0f5', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#0b1118', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'Studiorum — AceYKN 的学习笔记' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'AceYKN,学习笔记,笔记整理,数学笔记,计算机科学,操作系统,算法,数据库,软件工程,抽象代数,数学分析,常微分方程,Studiorum'
      }
    ],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-DMLQNKGTNZ' }],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-DMLQNKGTNZ');"
    ]
  ],

  // 7. 为每页自动注入 OG 标签和 JSON-LD
  transformHead({ pageData, siteData }) {
    const head = []
    const title = pageData.title || siteData.title
    const baseUrl = 'https://aceykn.github.io/my-note'
    const pageUrl = `${baseUrl}/${pageData.relativePath.replace(/(\.md)?$/, '.html').replace(/index\.html$/, '')}`

    // 自动生成 description：frontmatter > 全站描述兜底，并拼接页面标题提升关键词覆盖
    const siteFallback = siteData.description
    let description = pageData.description
    if (!description && pageData.title && pageData.title !== siteData.title) {
      description = `${pageData.title} — ${siteFallback}`
    }
    description = description || siteFallback

    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    if (description) {
      head.push(['meta', { name: 'description', content: description }])
      head.push(['meta', { property: 'og:description', content: description }])
    }

    // 如需自定义 OG 图片，可在 frontmatter 中设置 ogImage
    const ogImage = pageData.frontmatter.ogImage || `${baseUrl}/og-default.svg`
    head.push(['meta', { property: 'og:image', content: ogImage }])

    // 判断是否为学术笔记页面
    const isAcademic = /\/(math|cs|os|algo|db|se|ode|abstract_algebra|math_analysis)\//.test(
      pageData.relativePath
    )

    // 为文章生成 JSON-LD 结构化数据
    const datePublished = pageData.frontmatter.date || new Date().toISOString().split('T')[0]
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': isAcademic ? ['Article', 'LearningResource'] : 'Article',
      headline: title,
      description: description,
      url: pageUrl,
      author: {
        '@type': 'Person',
        name: 'AceYKN'
      },
      datePublished: datePublished,
      image: ogImage
    }

    // 学术笔记额外补充 LearningResource 字段
    if (isAcademic) {
      jsonLd.educationalLevel = 'undergraduate'
      jsonLd.learningResourceType = 'lecture notes'
      jsonLd.inLanguage = 'zh-CN'
      jsonLd.provider = {
        '@type': 'Person',
        name: 'AceYKN'
      }
    }

    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

    return head
  }
})
