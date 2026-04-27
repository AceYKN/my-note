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
 * 新目录需要在下方 FALLBACK_DIR_NAMES 中添加映射。
 */

import fs from 'node:fs'
import path from 'node:path'

// ============================================================
// 目录名 → 侧边栏显示名 (可选映射，作为兜底)
// ============================================================
const FALLBACK_DIR_NAMES = {
  // 数学
  abstract_algebra: '抽象代数',
  math_analysis: '数学分析',
  ode: '常微分方程',
  math: '数学',
  // 计算机科学
  cs: '计算机科学',
  os: '操作系统',
  algo: '算法设计与分析',
  db: '数据库系统',
  se: '软件工程',
  code: '编程入门',
  // 语言
  language: '言語',
  deutsch: 'Deutsch',
  nihongo: '日本語',
  'german-for-reading': 'German for Reading',
  // 通用
  notes: 'ノート',
  note: 'ノート',
  notesbychap: '章節ノート',
  review: '復習',
  pastpapers: '過去問',
  HW: '宿題'
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

/** 获取目录的显示名称 */
function getDirDisplayName(dirPath, dirName) {
  // 1. 尝试从 meta.json 读取
  const metaPath = path.join(dirPath, 'meta.json')
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      if (meta.title) return meta.title
    } catch (e) {
      console.error(`Error parsing ${metaPath}:`, e)
    }
  }

  // 2. 尝试从 index.md 读取
  const indexPath = path.join(dirPath, 'index.md')
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8')
    const fm = parseFrontmatter(content)
    if (fm.title) return fm.title

    // 3. 如果没有 frontmatter，尝试取第一个标题
    const h = content.match(/^#\s+(.+)$/m)
    if (h) return h[1].trim()
  }

  // 4. 尝试兜底映射
  if (FALLBACK_DIR_NAMES[dirName]) return FALLBACK_DIR_NAMES[dirName]

  // 5. 将下划线转为空格并首字母大写
  return dirName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
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
      order: meta.order
    })
  }

  items.sort((a, b) => a.order - b.order)
  // eslint-disable-next-line no-unused-vars
  return items.map(({ order: _order, ...rest }) => rest)
}

/** 扫描一个顶级目录，生成其侧边栏配置 */
function buildSidebarForDir(dirPath, urlPrefix) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const subDirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  const result = []

  // 子目录 → 折叠分组（递归支持多层嵌套）
  for (const dir of subDirs) {
    const subPath = path.join(dirPath, dir.name)
    const items = buildSidebarForDir(subPath, `${urlPrefix}${dir.name}/`)
    if (items.length === 0) continue
    result.push({
      text: getDirDisplayName(subPath, dir.name),
      collapsed: true,
      items
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
 * 递归注册目录及其所有子目录为独立的 sidebar key。
 * VitePress 按最长前缀匹配 key，只有当路由精确命中某个 key 时
 * 该 key 的 sidebar 才会被激活。因此三级目录 /cs/os/HW/ 必须有自己的 key，
 * 否则访问其中的页面时 VitePress 找不到对应 sidebar 而显示空白。
 */
function registerSidebarKeys(sidebar, dirPath, urlPrefix, groupText) {
  const items = buildSidebarForDir(dirPath, urlPrefix)
  if (items.length === 0) return

  // 注册当前目录为独立 key
  sidebar[urlPrefix] = groupText ? [{ text: groupText, items }] : items

  // 递归注册所有子目录为独立 key（支持任意深度嵌套）
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const subDirPath = path.join(dirPath, entry.name)
    const subPrefix = `${urlPrefix}${entry.name}/`
    // 子目录沿用父目录的分组标题（即课程名），不再新建标题
    registerSidebarKeys(sidebar, subDirPath, subPrefix, groupText)
  }
}

/**
 * @param {string} docsDir - docs 目录的绝对路径
 * @returns {object} VitePress sidebar 配置对象
 */
export function generateSidebar(docsDir) {
  const sidebar = {}
  const entries = fs.readdirSync(docsDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || IGNORED_DIRS.has(entry.name)) continue
    const topDirPath = path.join(docsDir, entry.name)
    const topPrefix = `/${entry.name}/`

    // 顶级目录：直接注册（不带分组标题）
    registerSidebarKeys(sidebar, topDirPath, topPrefix, null)

    // 一级子目录（课程）：注册并附带课程名称作为分组标题
    const subEntries = fs.readdirSync(topDirPath, { withFileTypes: true })
    for (const subEntry of subEntries) {
      if (!subEntry.isDirectory() || subEntry.name.startsWith('.')) continue
      const subDirPath = path.join(topDirPath, subEntry.name)
      const subPrefix = `${topPrefix}${subEntry.name}/`
      const groupText = getDirDisplayName(subDirPath, subEntry.name)
      // 递归注册该课程目录及其所有子目录（HW、note 等），共享同一份侧边栏内容
      registerSidebarKeys(sidebar, subDirPath, subPrefix, groupText)
    }
  }

  return sidebar
}
