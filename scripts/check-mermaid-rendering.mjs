import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import config from '../docs/.vitepress/config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '../docs')

const md = await createMarkdownRenderer(docsDir, config.markdown, config.base)
const rendered = md.render(`\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\``)

assert.ok(
  !rendered.includes('language-mermaid'),
  `Expected Mermaid blocks to be rendered as diagrams instead of highlighted code:\n${rendered}`
)
