#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const vitepressDir = path.join(repoRoot, 'docs', '.vitepress')
const generatedDirs = ['.temp', 'cache', 'dist']

for (const dirName of generatedDirs) {
  const target = path.join(vitepressDir, dirName)
  const relativeTarget = path.relative(vitepressDir, target)

  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) {
    throw new Error(`Refusing to remove outside docs/.vitepress: ${target}`)
  }

  fs.rmSync(target, { recursive: true, force: true })
}
