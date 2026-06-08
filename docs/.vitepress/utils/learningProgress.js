export const LEARNING_PROGRESS_STORAGE_KEY = 'studiorum.learning-progress.v1'
export const LEARNING_PROGRESS_UPDATED_EVENT = 'studiorum-learning-progress-updated'
export const LEARNING_RESUME_PARAM = 'resume'

const STATE_VERSION = 1
const DEFAULT_RECENT_LIMIT = 12
const DEFAULT_COMPLETION_THRESHOLD = 92

export function createEmptyLearningState() {
  return {
    version: STATE_VERSION,
    recent: [],
    pages: {}
  }
}

export function normalizeLearningPath(path) {
  if (!path || typeof path !== 'string') return ''
  return path
    .replace(/^\/my-note\//, '')
    .replace(/^\//, '')
    .replace(/\.html$/, '.md')
    .replace(/\/$/, '/index.md')
}

export function isTrackableLearningPath(path) {
  const normalized = normalizeLearningPath(path)
  return Boolean(
    normalized &&
    normalized !== 'index.md' &&
    normalized !== '404.md' &&
    !normalized.endsWith('/index.md')
  )
}

export function readLearningState(storage = getBrowserStorage()) {
  if (!storage) return createEmptyLearningState()

  try {
    return normalizeLearningState(JSON.parse(storage.getItem(LEARNING_PROGRESS_STORAGE_KEY)))
  } catch {
    return createEmptyLearningState()
  }
}

export function saveLearningState(state, storage = getBrowserStorage()) {
  if (!storage) return
  storage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(normalizeLearningState(state)))
}

export function clearLearningState(storage = getBrowserStorage()) {
  if (!storage) return
  storage.removeItem(LEARNING_PROGRESS_STORAGE_KEY)
}

export function recordLearningPageVisit(state, page, options = {}) {
  const current = normalizeLearningState(state)
  const path = normalizeLearningPath(page?.path)
  if (!isTrackableLearningPath(path)) return current

  const now = Number.isFinite(page.now)
    ? page.now
    : Number.isFinite(options.now)
      ? options.now
      : Date.now()
  const existing = current.pages[path] || {}
  const updatedPage = {
    path,
    title: cleanText(page.title) || existing.title || pathToTitle(path),
    url: normalizeLearningUrl(page.url || existing.url || pathToUrl(path)),
    section: inferLearningSection(path),
    progress: clampProgress(existing.progress),
    firstVisitedAt: Number.isFinite(existing.firstVisitedAt) ? existing.firstVisitedAt : now,
    lastVisitedAt: now,
    lastProgressAt: Number.isFinite(existing.lastProgressAt) ? existing.lastProgressAt : null,
    completedAt: Number.isFinite(existing.completedAt) ? existing.completedAt : null
  }

  return {
    ...current,
    pages: {
      ...current.pages,
      [path]: updatedPage
    },
    recent: [path, ...current.recent.filter((item) => item !== path)].slice(
      0,
      options.recentLimit || DEFAULT_RECENT_LIMIT
    )
  }
}

export function recordLearningPageProgress(state, progressUpdate, options = {}) {
  const current = normalizeLearningState(state)
  const path = normalizeLearningPath(progressUpdate?.path)
  if (!isTrackableLearningPath(path)) return current

  const now = Number.isFinite(progressUpdate.now)
    ? progressUpdate.now
    : Number.isFinite(options.now)
      ? options.now
      : Date.now()
  const threshold = options.completionThreshold || DEFAULT_COMPLETION_THRESHOLD
  const existing = current.pages[path] || {
    path,
    title: pathToTitle(path),
    url: pathToUrl(path),
    section: inferLearningSection(path),
    progress: 0,
    firstVisitedAt: now,
    lastVisitedAt: now,
    lastProgressAt: null,
    completedAt: null
  }
  const nextProgress = Math.max(
    clampProgress(existing.progress),
    clampProgress(progressUpdate.progress)
  )
  const completedAt =
    Number.isFinite(existing.completedAt) || nextProgress < threshold
      ? existing.completedAt || null
      : now

  return {
    ...current,
    pages: {
      ...current.pages,
      [path]: {
        ...existing,
        progress: nextProgress,
        lastProgressAt: now,
        completedAt
      }
    },
    recent: [path, ...current.recent.filter((item) => item !== path)].slice(
      0,
      options.recentLimit || DEFAULT_RECENT_LIMIT
    )
  }
}

export function getContinueLearningItems(state, options = {}) {
  const current = normalizeLearningState(state)
  const limit = options.limit || 3
  const paths = current.recent.length
    ? current.recent
    : Object.values(current.pages)
        .sort((a, b) => timestamp(b.lastVisitedAt) - timestamp(a.lastVisitedAt))
        .map((page) => page.path)

  return paths
    .map((path) => current.pages[path])
    .filter(Boolean)
    .map((page) => ({
      path: page.path,
      title: page.title || pathToTitle(page.path),
      url: page.url || pathToUrl(page.path),
      resumeUrl: createResumeLearningUrl(page.url || pathToUrl(page.path)),
      section: page.section || inferLearningSection(page.path),
      progress: Math.round(clampProgress(page.progress)),
      completed: Number.isFinite(page.completedAt),
      lastVisitedAt: page.lastVisitedAt || null
    }))
    .slice(0, limit)
}

export function getLearningPageProgress(state, path) {
  const current = normalizeLearningState(state)
  return clampProgress(current.pages[normalizeLearningPath(path)]?.progress)
}

export function getLearningSummary(state) {
  const pages = Object.values(normalizeLearningState(state).pages)
  return {
    totalVisited: pages.length,
    totalCompleted: pages.filter((page) => Number.isFinite(page.completedAt)).length
  }
}

export function createResumeLearningUrl(url) {
  const normalized = normalizeLearningUrl(url)
  if (!normalized) return ''

  const hashIndex = normalized.indexOf('#')
  const pathWithQuery = hashIndex === -1 ? normalized : normalized.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : normalized.slice(hashIndex)
  const queryIndex = pathWithQuery.indexOf('?')
  const path = queryIndex === -1 ? pathWithQuery : pathWithQuery.slice(0, queryIndex)
  const query = queryIndex === -1 ? '' : pathWithQuery.slice(queryIndex + 1)
  const params = new globalThis.URLSearchParams(query)
  params.set(LEARNING_RESUME_PARAM, '1')

  return `${path}?${params.toString()}${hash}`
}

export function dispatchLearningProgressUpdated() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new window.CustomEvent(LEARNING_PROGRESS_UPDATED_EVENT))
}

function normalizeLearningState(value) {
  if (!value || typeof value !== 'object') return createEmptyLearningState()

  const pages = {}
  for (const [rawPath, rawPage] of Object.entries(value.pages || {})) {
    const path = normalizeLearningPath(rawPage?.path || rawPath)
    if (!isTrackableLearningPath(path)) continue
    pages[path] = {
      path,
      title: cleanText(rawPage?.title) || pathToTitle(path),
      url: normalizeLearningUrl(rawPage?.url || pathToUrl(path)),
      section: cleanText(rawPage?.section) || inferLearningSection(path),
      progress: clampProgress(rawPage?.progress),
      firstVisitedAt: nullableTimestamp(rawPage?.firstVisitedAt),
      lastVisitedAt: nullableTimestamp(rawPage?.lastVisitedAt),
      lastProgressAt: nullableTimestamp(rawPage?.lastProgressAt),
      completedAt: nullableTimestamp(rawPage?.completedAt)
    }
  }

  const recent = Array.isArray(value.recent)
    ? value.recent.map(normalizeLearningPath).filter((path) => pages[path])
    : []

  return {
    version: STATE_VERSION,
    pages,
    recent: [...new Set(recent)].slice(0, DEFAULT_RECENT_LIMIT)
  }
}

function inferLearningSection(path) {
  if (path.startsWith('code/vue/')) return 'Vue'
  if (path.startsWith('code/')) return 'DEV'
  if (path.startsWith('cs/os/')) return 'OS'
  if (path.startsWith('cs/db/')) return 'DB'
  if (path.startsWith('cs/algo/')) return 'Algo'
  if (path.startsWith('cs/se/')) return 'SE'
  if (path.startsWith('cs/')) return 'CS'
  if (path.startsWith('math/abstract_algebra/')) return 'Algebra'
  if (path.startsWith('math/math_analysis/')) return 'Analysis'
  if (path.startsWith('math/ode/')) return 'ODE'
  if (path.startsWith('math/')) return 'Math'
  if (path.startsWith('language/deutsch/')) return 'Deutsch'
  if (path.startsWith('language/')) return 'Language'
  return 'Note'
}

function pathToTitle(path) {
  const filename = path.split('/').pop() || path
  return filename.replace(/\.md$/, '').replace(/[-_]/g, ' ')
}

function pathToUrl(path) {
  return `/${path.replace(/\.md$/, '').replace(/\/index$/, '/')}`
}

function normalizeLearningUrl(url) {
  const cleaned = cleanText(url)
  if (!cleaned) return ''
  const withoutBase = cleaned.replace(/^\/my-note(?=\/|$)/, '')
  const hashIndex = withoutBase.indexOf('#')
  const pathWithQuery = hashIndex === -1 ? withoutBase : withoutBase.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : withoutBase.slice(hashIndex)
  const queryIndex = pathWithQuery.indexOf('?')
  const path = queryIndex === -1 ? pathWithQuery : pathWithQuery.slice(0, queryIndex)
  const query = queryIndex === -1 ? '' : pathWithQuery.slice(queryIndex)
  const withoutHtml = `${path.replace(/\.html$/, '')}${query}${hash}`
  return withoutHtml.startsWith('/') ? withoutHtml : `/${withoutHtml}`
}

function clampProgress(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.min(100, Math.max(0, numeric))
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function timestamp(value) {
  return Number.isFinite(value) ? value : 0
}

function nullableTimestamp(value) {
  return Number.isFinite(value) ? value : null
}

function getBrowserStorage() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}
