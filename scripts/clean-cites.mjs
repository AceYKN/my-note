/**
 * clean-cites.mjs
 * 删除 markdown 文件里所有 [cite: ...] 标签。
 *
 * 用法：
 *   node scripts/clean-cites.mjs <file>
 *   npm run clean <file>
 *
 * 示例：
 *   npm run clean docs/cs/se/notesbychap/chap8.md
 */

import { readFileSync, writeFileSync } from 'fs'

const file = process.argv[2]
if (!file) {
  console.error('用法: node scripts/clean-cites.mjs <file>')
  console.error('示例: npm run clean docs/cs/se/notesbychap/chap8.md')
  process.exit(1)
}

const original = readFileSync(file, 'utf-8')
const cleaned  = original.replace(/\[cite:[^\]]*\]/g, '')

if (original === cleaned) {
  console.log('· 文件里没有 cite 标签，无需修改')
} else {
  writeFileSync(file, cleaned)
  const count = (original.match(/\[cite:[^\]]*\]/g) || []).length
  console.log(`✓ 已删除 ${count} 个 cite 标签 → ${file}`)
}
