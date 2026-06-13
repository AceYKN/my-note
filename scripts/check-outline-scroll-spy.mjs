import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { clearTimeout as nodeClearTimeout, setTimeout as nodeSetTimeout } from 'node:timers'
import { setTimeout as wait } from 'node:timers/promises'
import { URL } from 'node:url'
import vm from 'node:vm'

class FakeClassList {
  constructor(initial = []) {
    this.classes = new Set(initial)
  }

  add(name) {
    this.classes.add(name)
  }

  remove(name) {
    this.classes.delete(name)
  }

  contains(name) {
    return this.classes.has(name)
  }
}

class FakeElement {
  constructor({ id = '', href = '', classes = [], offsetTop = 0, offsetParent = null } = {}) {
    this.id = id
    this.href = href
    this.classList = new FakeClassList(classes)
    this.style = {}
    this.offsetParent = offsetParent
    this._offsetTop = offsetTop
    this.offsetTopReads = 0
  }

  get offsetTop() {
    this.offsetTopReads += 1
    return this._offsetTop
  }

  getAttribute(name) {
    return name === 'href' ? this.href : null
  }

  getBoundingClientRect() {
    return { top: this._offsetTop, bottom: this._offsetTop + 20 }
  }
}

class FakeOutline extends FakeElement {
  constructor(links, marker) {
    super({ classes: ['VPDocAsideOutline'] })
    this.links = links
    this.marker = marker
  }

  querySelector(selector) {
    if (selector === '.outline-marker') return this.marker
    if (selector === 'a.active')
      return this.links.find((link) => link.classList.contains('active')) || null

    const hrefMatch = selector.match(/^a\[href="(.+)"\]$/)
    if (hrefMatch) {
      return this.links.find((link) => link.href === hrefMatch[1]) || null
    }

    return null
  }

  querySelectorAll(selector) {
    if (selector === 'a' || selector === 'a[href^="#"]') return this.links
    return []
  }
}

class FakeDocument {
  constructor() {
    this.body = { offsetHeight: 2000 }
    this.headingQueryCount = 0
    this.nav = {
      getBoundingClientRect() {
        return { bottom: 0 }
      }
    }
    this.marker = new FakeElement()
    this.links = [
      new FakeElement({ href: '#intro', offsetTop: 10 }),
      new FakeElement({ href: '#deep-dive', offsetTop: 40 }),
      new FakeElement({ href: '#wrap-up', offsetTop: 70 })
    ]
    this.outline = new FakeOutline(this.links, this.marker)
    this.asideContainer = {
      getBoundingClientRect() {
        return { top: 0, bottom: 300 }
      },
      scrollBy() {}
    }
    this.headings = [
      new FakeElement({ id: 'intro', offsetTop: 100, offsetParent: this.body }),
      new FakeElement({ id: 'deep-dive', offsetTop: 300, offsetParent: this.body }),
      new FakeElement({ id: 'wrap-up', offsetTop: 900, offsetParent: this.body })
    ]
  }

  querySelector(selector) {
    if (selector === '.aside-container') return this.asideContainer
    if (selector === '.VPDocAsideOutline') return this.outline
    if (selector === '.VPDocAsideOutline .outline-marker') return this.marker
    if (selector === '.VPNav') return this.nav
    return null
  }

  querySelectorAll(selector) {
    if (selector === '.vp-doc :where(h1,h2,h3,h4,h5,h6)') {
      this.headingQueryCount += 1
      return this.headings
    }

    return []
  }

  resetMetrics() {
    this.headingQueryCount = 0
    for (const heading of this.headings) {
      heading.offsetTopReads = 0
    }
  }

  get headingOffsetReads() {
    return this.headings.reduce((total, heading) => total + heading.offsetTopReads, 0)
  }
}

class FakeWindow {
  constructor() {
    this.scrollY = 0
    this.innerHeight = 600
    this.listeners = new Map()
  }

  matchMedia() {
    return {
      matches: true,
      addEventListener() {},
      removeEventListener() {}
    }
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener)
  }

  removeEventListener(type, listener) {
    if (this.listeners.get(type) === listener) {
      this.listeners.delete(type)
    }
  }

  dispatch(type) {
    const listener = this.listeners.get(type)
    if (listener) listener()
  }
}

function loadScrollSpy({ document, window, source }) {
  const lifecycle = {
    mounted: [],
    unmounted: [],
    contentUpdated: []
  }

  const sandbox = {
    console,
    document,
    window,
    MutationObserver: class {
      disconnect() {}
      observe() {}
    },
    getComputedStyle() {
      return { paddingTop: '0' }
    },
    requestAnimationFrame(callback) {
      callback()
    },
    setTimeout: nodeSetTimeout,
    clearTimeout: nodeClearTimeout,
    onMounted(callback) {
      lifecycle.mounted.push(callback)
    },
    onUnmounted(callback) {
      lifecycle.unmounted.push(callback)
    },
    onContentUpdated(callback) {
      lifecycle.contentUpdated.push(callback)
    }
  }

  vm.createContext(sandbox)
  vm.runInContext(source, sandbox, { filename: 'useOutlineScrollSpy.js' })

  return {
    lifecycle,
    useOutlineScrollSpy: sandbox.__exports.useOutlineScrollSpy
  }
}

const sourcePath = new URL('../docs/.vitepress/composables/useOutlineScrollSpy.js', import.meta.url)
const rawSource = await readFile(sourcePath, 'utf8')
const transformedSource =
  rawSource
    .replace("import { onMounted, onUnmounted } from 'vue'\n", '')
    .replace("import { onContentUpdated } from 'vitepress'\n", '')
    .replace('export function useOutlineScrollSpy()', 'function useOutlineScrollSpy()') +
  '\nglobalThis.__exports = { useOutlineScrollSpy }\n'

const document = new FakeDocument()
const window = new FakeWindow()
const { lifecycle, useOutlineScrollSpy } = loadScrollSpy({
  document,
  window,
  source: transformedSource
})

useOutlineScrollSpy()
lifecycle.mounted.forEach((callback) => callback())

document.resetMetrics()
window.scrollY = 350
window.dispatch('scroll')
await wait(130)

assert.equal(
  document.headingQueryCount,
  0,
  'scroll should use cached headings instead of querySelectorAll'
)
assert.equal(document.headingOffsetReads, 0, 'scroll should use cached heading offsets')

lifecycle.contentUpdated.forEach((callback) => callback())
assert.equal(document.headingQueryCount, 1, 'content updates should refresh the heading cache once')

document.resetMetrics()
window.scrollY = 500
window.dispatch('scroll')
await wait(130)

assert.equal(
  document.headingQueryCount,
  0,
  'scroll after content update should still use cached headings'
)
assert.equal(
  document.headingOffsetReads,
  0,
  'scroll after content update should still use cached offsets'
)
