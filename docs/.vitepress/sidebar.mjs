/**
 * 侧边栏自动生成工具
 *
 * 添加新文档只需两步：
 *   1. 在对应目录下创建 .md 文件
 *   2. (可选) 添加 frontmatter 指定标题和排序
 *
 * Frontmatter 示例：
 *   ---
 *   title: 我的标题      # 侧边栏显示名称（默认取第一个 # 标题）
 *   order: 1             # 排序权重，越小越靠前（默认 999）
 *   sidebar: false        # 设为 false 则不出现在侧边栏
 *   ---
 *
 * 新目录需要在下方 DIR_DISPLAY_NAMES 中添加映射。
 */

import fs from 'node:fs'
import path from 'node:path'

// ============================================================
// 唯一需要维护的配置：目录名 → 侧边栏显示名
// 添加新目录时只需在这里加一行
// ============================================================
const DIR_DISPLAY_NAMES = {
  // /math/ 子目录
  abstract_algebra: '抽象代数',
  math_analysis: '数学分析',
  ode: '常微分方程',
  // /cs/ 子目录
  os: '操作系统',
  // /code/ 子目录（如果以后拆子目录）
}

// 不参与侧边栏生成的顶级目录
const IGNORED_DIRS = new Set(['.vitepress', 'public', 'node_modules'])

// ============================================================
// 内部工具函数
// ============================================================

/** 从 markdown 内容中解析 frontmatter */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (m) {
      let val = m[2].trim()
      // 去掉引号
      if (/^['"].*['"]$/.test(val)) val = val.slice(1, -1)
      result[m[1]] = val
    }
  }
  return result
}

/** 从一个 .md 文件中提取元信息 */
function getFileMeta(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const fm = parseFrontmatter(content)

  // 是否从侧边栏隐藏
  if (fm.sidebar === 'false' || fm.sidebar === false) {
    return null
  }

  // 标题：frontmatter → 第一个 # 标题 → 文件名
  let title = fm.title
  if (!title) {
    const h = content.match(/^#\s+(.+)$/m)
    if (h) title = h[1].trim()
  }
  if (!title) title = path.basename(filePath, '.md')

  const order = fm.order ? parseInt(fm.order, 10) : 999

  return { title, order }
}

/** 收集某个目录下的 .md 文件，返回排序后的侧边栏 items */
function collectFiles(dirPath, urlPrefix) {
  if (!fs.existsSync(dirPath)) return []

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const items = []

  // index.md → 链接到目录路径
  const indexFile = path.join(dirPath, 'index.md')
  if (fs.existsSync(indexFile)) {
    const meta = getFileMeta(indexFile)
    if (meta) {
      items.push({ text: meta.title, link: urlPrefix, order: meta.order })
    }
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'index.md') continue
    const meta = getFileMeta(path.join(dirPath, entry.name))
    if (!meta) continue
    items.push({
      text: meta.title,
      link: `${urlPrefix}${entry.name.replace(/\.md$/, '')}`,
      order: meta.order,
    })
  }

  items.sort((a, b) => a.order - b.order)
  return items.map(({ order, ...rest }) => rest)
}

/** 扫描一个顶级目录，生成其侧边栏配置 */
function buildSidebarForDir(dirPath, urlPrefix) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const subDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'))
  const result = []

  // 子目录 → 折叠分组
  for (const dir of subDirs) {
    const subPath = path.join(dirPath, dir.name)
    const items = collectFiles(subPath, `${urlPrefix}${dir.name}/`)
    if (items.length === 0) continue
    result.push({
      text: DIR_DISPLAY_NAMES[dir.name] || dir.name,
      collapsed: true,
      items,
    })
  }

  // 当前目录下的直属 .md 文件
  const directFiles = collectFiles(dirPath, urlPrefix)
  result.push(...directFiles)

  return result
}

// ============================================================
// 导出：自动生成完整 sidebar 配置
// ============================================================

/**
 * @param {string} docsDir - docs 目录的绝对路径
 * @returns {object} VitePress sidebar 配置对象
 */
export function generateSidebar(docsDir) {
  const sidebar = {}
  const entries = fs.readdirSync(docsDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) continue
    const dirPath = path.join(docsDir, entry.name)
    const prefix = `/${entry.name}/`
    const items = buildSidebarForDir(dirPath, prefix)
    if (items.length > 0) {
      sidebar[prefix] = items
    }
  }

  return sidebar
}
