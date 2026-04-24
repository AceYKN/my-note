/**
 * admin.mjs — 本地笔记管理服务器
 * 运行: npm run admin
 * 访问: http://localhost:3100
 */

import { createServer } from 'http'
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import { resolve, join, relative, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dir, '..')
const PORT = 3100
const HTML = readFileSync(join(__dir, 'admin.html'), 'utf-8')

// 防止路径穿越攻击
function safePath(p) {
  if (!p || typeof p !== 'string') throw new Error('Invalid path')
  const abs = resolve(ROOT, p.replace(/^[/\\]+/, ''))
  const rootNorm = ROOT.replace(/[/\\]+$/, '')
  const absNorm  = abs.replace(/[/\\]+$/, '')
  if (absNorm !== rootNorm && !absNorm.startsWith(rootNorm + '\\') && !absNorm.startsWith(rootNorm + '/')) {
    throw new Error('Path outside workspace is not allowed')
  }
  return abs
}

const SKIP = new Set(['.git', 'node_modules', 'cache', 'dist', 'temp_docs'])

function getTree(dir, depth = 0) {
  if (depth > 6) return []
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter(e => !e.name.startsWith('.') && !SKIP.has(e.name))
      .sort((a, b) => {
        if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name)
        return a.isDirectory() ? -1 : 1
      })
      .map(e => {
        const full = join(dir, e.name)
        const rel  = relative(ROOT, full).replace(/\\/g, '/')
        if (e.isDirectory()) {
          return { name: e.name, path: rel, type: 'dir', children: getTree(full, depth + 1) }
        }
        return { name: e.name, path: rel, type: 'file', ext: extname(e.name) }
      })
  } catch { return [] }
}

async function readBody(req) {
  return new Promise((res, rej) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      try { res(JSON.parse(Buffer.concat(chunks).toString())) }
      catch { rej(new Error('Invalid JSON body')) }
    })
    req.on('error', rej)
  })
}

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  const url      = new URL(req.url, `http://localhost:${PORT}`)
  const pathname = url.pathname
  const method   = req.method

  try {
    // ── Serve UI ──────────────────────────────────────
    if (pathname === '/' || pathname === '') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' })
      res.end(HTML)
      return
    }

    // ── File tree ─────────────────────────────────────
    if (pathname === '/api/tree' && method === 'GET') {
      const tree = [
        { name: 'docs',    path: 'docs',    type: 'dir', children: getTree(join(ROOT, 'docs')) },
        { name: 'scripts', path: 'scripts', type: 'dir', children: getTree(join(ROOT, 'scripts')) },
      ]
      json(res, tree)
      return
    }

    // ── Read file ─────────────────────────────────────
    if (pathname === '/api/file' && method === 'GET') {
      const p   = url.searchParams.get('path')
      const abs = safePath(p)
      if (!existsSync(abs)) { json(res, { error: 'File not found' }, 404); return }
      const content = readFileSync(abs, 'utf-8')
      json(res, { content })
      return
    }

    // ── Save file ─────────────────────────────────────
    if (pathname === '/api/save' && method === 'POST') {
      const { path: p, content } = await readBody(req)
      if (typeof content !== 'string') throw new Error('content must be a string')
      const abs = safePath(p)
      mkdirSync(dirname(abs), { recursive: true })
      writeFileSync(abs, content, 'utf-8')
      json(res, { ok: true })
      return
    }

    // ── Run action ────────────────────────────────────
    if (pathname === '/api/action' && method === 'POST') {
      const { action, args = [] } = await readBody(req)

      let cmd
      if (action === 'sync') {
        if (!args[0]) throw new Error('Missing directory argument')
        safePath(args[0]) // validate
        cmd = `node scripts/sync-index.mjs "${String(args[0]).replace(/"/g, '')}"`
      } else if (action === 'clean') {
        if (!args[0]) throw new Error('Missing file argument')
        safePath(args[0]) // validate
        cmd = `node scripts/clean-cites.mjs "${String(args[0]).replace(/"/g, '')}"`
      } else if (action === 'push') {
        // Sanitize commit message
        const msg = String(args[0] || 'docs: update notes')
          .replace(/["`$\\]/g, "'")
          .slice(0, 200)
        cmd = `node scripts/push.mjs "${msg}"`
      } else {
        throw new Error('Unknown action: ' + action)
      }

      let output
      try {
        output = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 30000 })
      } catch (execErr) {
        throw new Error((execErr.stderr || execErr.stdout || execErr.message).trim())
      }

      json(res, { ok: true, output: output || '' })
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  } catch (e) {
    json(res, { error: String(e.message) }, 400)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  ✓ Note Admin 已启动')
  console.log(`  ➜  http://localhost:${PORT}\n`)
})
