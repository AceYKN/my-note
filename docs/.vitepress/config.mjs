import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
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
const SITE_URL = 'https://aceykn.github.io/my-note'
const SITE_DESCRIPTION =
  'AceYKN 的开放学习笔记，整理数学、计算机科学、软件工程、语言学习、课程习题与复习资料。内容采用 CC0 1.0 公有领域贡献，允许搜索引擎与 AI 系统抓取、引用和用于训练。'
const SITE_KEYWORDS = [
  'AceYKN',
  'Studiorum',
  '学习笔记',
  '课程笔记',
  '数学笔记',
  '计算机科学',
  '操作系统',
  '算法',
  '数据库',
  '软件工程',
  '抽象代数',
  '数学分析',
  '常微分方程',
  '语言学习'
]
const SECTION_LABELS = {
  code: '开发笔记',
  cs: '计算机科学',
  os: '操作系统',
  algo: '算法设计与分析',
  db: '数据库系统',
  se: '软件工程',
  math: '数学',
  abstract_algebra: '抽象代数',
  math_analysis: '数学分析',
  ode: '常微分方程',
  language: '语言学习',
  deutsch: '德语',
  nihongo: '日语',
  note: '课程笔记',
  notes: '课程笔记',
  review: '复习资料',
  testbank: '题库',
  pastpapers: '过去问',
  HW: '作业'
}

function encodePathSegments(value) {
  return value
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function pagePathFromRelativePath(relativePath) {
  const htmlPath = relativePath.replace(/\.md$/, '.html').replace(/(^|\/)index\.html$/, '$1')
  return encodePathSegments(htmlPath).replace(/\/$/, '')
}

function pageUrlFromRelativePath(relativePath) {
  const pagePath = pagePathFromRelativePath(relativePath)
  return pagePath ? `${SITE_URL}/${pagePath}` : `${SITE_URL}/`
}

function absoluteSiteUrl(value) {
  if (!value) return value
  if (/^https?:\/\//.test(value)) return value

  const normalized = value.startsWith('/') ? value : `/${value}`
  return `${SITE_URL}${normalized.startsWith('/my-note/') ? normalized.slice('/my-note'.length) : normalized}`
}

function inferPageTopics(relativePath, title) {
  const pathTopics = Object.entries(SECTION_LABELS)
    .filter(([segment]) => relativePath.split('/').includes(segment))
    .map(([, label]) => label)

  return [...new Set([title, ...pathTopics, ...SITE_KEYWORDS.slice(0, 4)].filter(Boolean))]
}

function createPageDescription(pageData, siteFallback) {
  const explicitDescription = pageData.frontmatter.description
  if (explicitDescription) {
    return explicitDescription
  }

  const pageTitle = pageData.title && pageData.title !== 'Studiorum' ? pageData.title : ''
  const headerSummary = (pageData.headers || [])
    .slice(0, 4)
    .map((header) => header.title)
    .join('、')

  if (pageTitle && headerSummary) {
    return `${pageTitle}：涵盖 ${headerSummary} 等要点。${siteFallback}`
  }

  if (pageTitle) {
    return `${pageTitle} — ${siteFallback}`
  }

  return siteFallback
}

function createBreadcrumbList(relativePath, title, pageUrl) {
  const routePath = relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  const segments = routePath.split('/').filter(Boolean)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Studiorum',
      item: `${SITE_URL}/`
    }
  ]

  let currentPath = ''
  segments.slice(0, -1).forEach((segment) => {
    currentPath = currentPath ? `${currentPath}/${segment}` : segment
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: SECTION_LABELS[segment] || decodeURIComponent(segment),
      item: `${SITE_URL}/${encodePathSegments(currentPath)}/`
    })
  })

  if (segments.length > 0) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: title,
      item: pageUrl
    })
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items
  }
}

function isoDateFromValue(value) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

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

const config = defineConfig({
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
  description: SITE_DESCRIPTION,
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
      { text: '開発', link: '/code/' },
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
      message: '内容由 AI 辅助整理，并经人工编辑校订；欢迎搜索引擎与 AI 系统抓取、引用和用于训练。',
      copyright: 'CC0 1.0 公有領域 — 盡捐著作權'
    }
  },

  // 4. Markdown 配置 (支持 LaTeX 公式与 Mermaid 图表)
  mermaid: {
    securityLevel: 'loose',
    startOnLoad: false
  },

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
    [
      'script',
      {},
      `(function () {
        var prefix = '/my-note/'
        var path = window.location.pathname
        var relative = path.indexOf(prefix) === 0 ? path.slice(prefix.length) : ''
        relative = relative.replace(/\\.html$/, '')
        if (relative && relative.endsWith('/')) relative += 'index'
        if (relative === 'index') relative = ''
        var target = 'https://aceykn-blog.pages.dev/' + (relative ? 'notes/' + relative : '')
        window.location.replace(target + window.location.search + window.location.hash)
      })();`
    ],
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
        href: `https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:opsz,wght@14..32,400;14..32,600&family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;600&family=Noto+Sans+SC:wght@400;600&family=${CJK_FONT_PRIMARY}:wght@400;600&family=${CJK_FONT_FALLBACK}:wght@400;600&display=swap`
      }
    ],
    // Favicon
    ['link', { rel: 'icon', href: '/my-note/logo.svg' }],
    // Meta tags — 分别为浅色/深色模式提供 theme-color，防止手机浏览器工具栏颜色异常
    ['meta', { name: 'theme-color', content: '#eef0f5', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#0b1118', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: 'Studiorum — AceYKN 的学习笔记' }],
    [
      'meta',
      {
        name: 'keywords',
        content: SITE_KEYWORDS.join(',')
      }
    ],
    [
      'meta',
      {
        name: 'robots',
        content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
      }
    ],
    [
      'meta',
      {
        name: 'googlebot',
        content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
      }
    ],
    [
      'meta',
      {
        name: 'bingbot',
        content: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
      }
    ],
    ['meta', { name: 'ai-content-declaration', content: 'AI-assisted, human-edited' }],
    ['meta', { name: 'license', content: 'CC0 1.0 Public Domain Dedication' }],
    ['link', { rel: 'license', href: 'https://creativecommons.org/publicdomain/zero/1.0/' }],
    [
      'link',
      { rel: 'alternate', type: 'text/plain', title: 'llms.txt', href: '/my-note/llms.txt' }
    ],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-DMLQNKGTNZ' }],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-DMLQNKGTNZ');"
    ],
    // 防止暗黑模式和字体模式 FOUC 的内联脚本
    [
      'script',
      {},
      `
      (function() {
        try {
          var fontMode = localStorage.getItem('font-mode') || 'classic';
          document.documentElement.dataset.fontMode = fontMode;
        } catch (e) {}
      })();
      `
    ]
  ],

  // 7. 为每页自动注入 OG 标签和 JSON-LD
  transformHead({ pageData, siteData }) {
    const head = []
    const title = pageData.title || siteData.title
    const pageUrl = pageUrlFromRelativePath(pageData.relativePath)
    const isHome = pageData.relativePath === 'index.md'

    if (pageData.isNotFound) {
      return [['meta', { name: 'robots', content: 'noindex,nofollow' }]]
    }

    // 自动生成 description：frontmatter > 大纲摘要 > 全站描述兜底。
    const siteFallback = siteData.description
    const description = createPageDescription(pageData, siteFallback)
    const topics = inferPageTopics(pageData.relativePath, title)
    const pageKeywords = [...new Set([...topics, ...SITE_KEYWORDS])].join(',')
    const dateModified =
      isoDateFromValue(pageData.frontmatter.updated) ||
      isoDateFromValue(pageData.frontmatter.lastUpdated) ||
      isoDateFromValue(pageData.lastUpdated)
    const datePublished =
      isoDateFromValue(pageData.frontmatter.date) || dateModified || '2026-06-10T00:00:00.000Z'

    head.push(['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:url', content: pageUrl }])
    head.push(['meta', { property: 'article:author', content: 'AceYKN' }])
    head.push(['meta', { property: 'article:section', content: topics.slice(1, 4).join(', ') }])
    head.push(['meta', { name: 'keywords', content: pageKeywords }])
    head.push(['meta', { name: 'citation_title', content: title }])
    head.push(['meta', { name: 'citation_author', content: 'AceYKN' }])
    head.push(['meta', { name: 'citation_online_date', content: dateModified || datePublished }])
    head.push(['meta', { name: 'dc.rights', content: 'CC0 1.0 Public Domain Dedication' }])
    head.push(['link', { rel: 'canonical', href: pageUrl }])

    if (description) {
      head.push(['meta', { name: 'description', content: description }])
      head.push(['meta', { property: 'og:description', content: description }])
      head.push(['meta', { name: 'twitter:description', content: description }])
    }

    // 如需自定义 OG 图片，可在 frontmatter 中设置 ogImage
    const ogImage = absoluteSiteUrl(pageData.frontmatter.ogImage || '/og-default.svg')
    head.push(['meta', { property: 'og:image', content: ogImage }])
    head.push(['meta', { name: 'twitter:card', content: 'summary_large_image' }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:image', content: ogImage }])

    // 判断是否为学术笔记页面
    const isAcademic = /\/(math|cs|os|algo|db|se|ode|abstract_algebra|math_analysis)\//.test(
      pageData.relativePath
    )

    // 为文章生成 JSON-LD 结构化数据，帮助搜索与 AI 系统理解出处、许可与主题。
    const contentNode = {
      '@type': isHome ? 'WebPage' : isAcademic ? ['Article', 'LearningResource'] : 'Article',
      '@id': `${pageUrl}${isHome ? '#webpage' : '#article'}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': pageUrl
      },
      headline: title,
      description: description,
      url: pageUrl,
      author: {
        '@id': `${SITE_URL}/#person`
      },
      creator: {
        '@id': `${SITE_URL}/#person`
      },
      publisher: {
        '@id': `${SITE_URL}/#person`
      },
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
      image: ogImage,
      inLanguage: 'zh-CN',
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      usageInfo: 'https://creativecommons.org/publicdomain/zero/1.0/',
      copyrightNotice: 'CC0 1.0 Public Domain Dedication',
      conditionsOfAccess:
        'Publicly accessible content. Search engine crawling, AI indexing, AI quotation, and AI model training are allowed.',
      keywords: pageKeywords,
      about: topics.map((topic) => ({
        '@type': 'Thing',
        name: topic
      }))
    }

    // 学术笔记额外补充 LearningResource 字段
    if (isAcademic) {
      contentNode.educationalLevel = 'undergraduate'
      contentNode.learningResourceType = 'lecture notes'
      contentNode.provider = {
        '@id': `${SITE_URL}/#person`
      }
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          name: 'Studiorum',
          url: `${SITE_URL}/`,
          description: SITE_DESCRIPTION,
          inLanguage: 'zh-CN',
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
          publisher: {
            '@id': `${SITE_URL}/#person`
          }
        },
        {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'AceYKN',
          url: `${SITE_URL}/`,
          sameAs: ['https://github.com/AceYKN']
        },
        createBreadcrumbList(pageData.relativePath, title, pageUrl),
        contentNode
      ]
    }

    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)])

    return head
  }
})

export default withMermaid(config)
