/**
 * push.mjs
 * 一键 git add → commit → push。
 *
 * 用法：
 *   node scripts/push.mjs [commit message]
 *   npm run push
 *   npm run push "feat: 添加第8章笔记"
 */

import { execSync } from 'child_process'

const msg = process.argv.slice(2).join(' ') || 'docs: update notes'

function run(cmd) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

run('git add -A')
run(`git commit -m "${msg}"`)
run('git push')
