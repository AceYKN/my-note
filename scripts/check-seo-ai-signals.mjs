import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../docs/.vitepress/dist')

function readDistFile(relativePath) {
  const filePath = path.join(distDir, relativePath)
  assert.ok(fs.existsSync(filePath), `Expected ${relativePath} to exist in built output`)
  return fs.readFileSync(filePath, 'utf8')
}

const robots = readDistFile('robots.txt')
const llms = readDistFile('llms.txt')
const sampleHtml = readDistFile('cs/os/note/chap2.html')
const sitemap = readDistFile('sitemap.xml')

for (const crawler of [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'PerplexityBot'
]) {
  assert.match(robots, new RegExp(`User-agent:\\s*${crawler}`, 'i'))
}

assert.match(robots, /Sitemap:\s*https:\/\/aceykn\.github\.io\/my-note\/sitemap\.xml/i)
assert.match(llms, /AI training:\s*allowed/i)
assert.match(llms, /CC0 1\.0/i)
assert.match(llms, /https:\/\/aceykn\.github\.io\/my-note\/sitemap\.xml/i)
assert.match(
  sampleHtml,
  /<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">/
)
assert.match(sampleHtml, /<meta name="ai-content-declaration" content="AI-assisted, human-edited">/)
assert.match(sampleHtml, /"license":"https:\/\/creativecommons\.org\/publicdomain\/zero\/1\.0\/"/)
assert.match(sampleHtml, /"isAccessibleForFree":true/)
assert.match(sampleHtml, /"@type":"BreadcrumbList"/)
assert.match(
  sitemap,
  /<loc>https:\/\/aceykn\.github\.io\/my-note\/cs\/os\/note\/chap2\.html<\/loc>/
)
