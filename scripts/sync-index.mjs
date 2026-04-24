/**
 * sync-index.mjs
 * 自动把某个笔记目录下所有 .md 文件同步成 index.md 里的 file-card 入口。
 *
 * 用法：
 *   node scripts/sync-index.mjs <notesDir>
 *
 * 示例：
 *   node scripts/sync-index.mjs docs/cs/se/notesbychap
 *   npm run sync docs/cs/se/notesbychap
 *
 * 前提：在对应的 index.md 里，用注释标记出要同步的区域：
 *   <!-- sync-start: notesbychap -->
 *   <div class="file-grid">...</div>
 *   <!-- sync-end: notesbychap -->
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, resolve, relative, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_ROOT = join(ROOT, 'docs')
const VITEPRESS_BASE = '/my-note'

/** 从 markdown 文件提取 title 和 desc，优先 frontmatter，其次第一行标题 */
function parseTitle(filePath) {
  let content = ''
  try { content = readFileSync(filePath, 'utf-8') } catch { /* empty file */ }
  // 去掉 BOM
  content = content.replace(/^\uFEFF/, '')

  // 1. 尝试 frontmatter title
  const fmMatch = content.match(/^---[\s\S]*?^title:\s*(.+)/m)
  if (fmMatch) return { title: fmMatch[1].trim(), desc: '' }

  // 2. 优先找 h1（只取第一个 # 标题，不限于 ## 以内，避免跳过 h1 去读 h2）
  const h1Match = content.match(/^#\s+(.+)/m)
  if (h1Match) {
    const heading = h1Match[1].trim().replace(/\*\*/g, '')
    if (!/^executive summary$/i.test(heading)) {
      const colonIdx = heading.indexOf(': ')
      const dashIdx  = heading.indexOf(' - ')
      if (colonIdx !== -1) return { title: heading.slice(0, colonIdx).trim(), desc: heading.slice(colonIdx + 2).trim() }
      if (dashIdx  !== -1) return { title: heading.slice(0, dashIdx).trim(),  desc: heading.slice(dashIdx  + 3).trim() }
      return { title: heading, desc: '' }
    }
  }

  // 3. fallback：chapN → Chapter N，其他就用文件名
  const base = basename(filePath, '.md')
  const chapMatch = base.match(/^chap(\d+)$/i)
  if (chapMatch) return { title: `Chapter ${chapMatch[1]}`, desc: '' }
  return { title: base, desc: '' }
}

/** 生成单个 file-card HTML */
function card(href, title, desc) {
  return `    <a class="file-card" href="${href}">
      <span class="file-icon">📄</span>
      <span class="file-name">${title}</span>
      <span class="file-desc">${desc}</span>
    </a>`
}

// ── main ──────────────────────────────────────────────────────────────────────
const notesDir = process.argv[2]
if (!notesDir) {
  console.error('用法: node scripts/sync-index.mjs <notesDir>')
  console.error('示例: node scripts/sync-index.mjs docs/cs/se/notesbychap')
  process.exit(1)
}

const absDir   = resolve(ROOT, notesDir)
const dirName  = basename(absDir)
const indexPath = join(absDir, '..', 'index.md')

// 读取目录下所有 .md（按文件名排序，排除 index.md，排除空 basename 的文件如 .md）
const files = readdirSync(absDir)
  .filter(f => f.endsWith('.md') && f !== 'index.md' && basename(f, '.md') !== '')
  .sort()

// 相对于 docs/ 的路径，用于拼 URL
const relToDocsRoot = relative(DOCS_ROOT, absDir).replace(/\\/g, '/')

// 生成所有卡片
const cards = files.map(file => {
  const { title, desc } = parseTitle(join(absDir, file))
  const href = `${VITEPRESS_BASE}/${relToDocsRoot}/${basename(file, '.md')}`
  return card(href, title, desc)
}).join('\n')

// 读取并更新 index.md
let idx = readFileSync(indexPath, 'utf-8')

const startTag = `<!-- sync-start: ${dirName} -->`
const endTag   = `<!-- sync-end: ${dirName} -->`

if (!idx.includes(startTag)) {
  console.error(`❌ 在 ${indexPath} 里找不到标记 "${startTag}"`)
  console.error('请在 index.md 里要同步的 <div class="file-grid"> 前后加上：')
  console.error(`  ${startTag}`)
  console.error(`  <div class="file-grid">...</div>`)
  console.error(`  ${endTag}`)
  process.exit(1)
}

const newBlock = `${startTag}\n  <div class="file-grid">\n${cards}\n  </div>\n  ${endTag}`
const updated  = idx.replace(new RegExp(`${startTag}[\\s\\S]*?${endTag}`), newBlock)

writeFileSync(indexPath, updated)
console.log(`✓ 已同步 ${files.length} 个文件 → ${relative(ROOT, indexPath)}`)
files.forEach(f => console.log(`  · ${f}`))
