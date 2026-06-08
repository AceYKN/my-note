import { onMounted, onUnmounted } from 'vue'
import { onContentUpdated, useData, useRoute, useRouter } from 'vitepress'
import {
  dispatchLearningProgressUpdated,
  getLearningPageProgress,
  LEARNING_RESUME_PARAM,
  readLearningState,
  recordLearningPageProgress,
  recordLearningPageVisit,
  saveLearningState
} from '../utils/learningProgress.js'

let activeTrackerCleanup = null

export function useLearningProgressTracker() {
  const { page } = useData()
  const route = useRoute()
  const router = useRouter()
  let currentPath = null
  let ticking = false
  let lastSavedProgress = -1
  let lastSavedAt = 0
  let beforeUnloadHandler = null
  let previousBeforeRouteChange = null
  let routeChangeHandler = null
  let resumePending = false

  activeTrackerCleanup?.()

  function getCurrentPage() {
    const relativePath = page.value.relativePath
    if (!relativePath || relativePath === 'index.md' || relativePath.endsWith('/index.md')) {
      return null
    }

    return {
      path: relativePath,
      title: page.value.title,
      url: route.path
    }
  }

  function recordVisit() {
    const currentPage = getCurrentPage()
    if (!currentPage) {
      currentPath = null
      return
    }

    currentPath = currentPage.path
    lastSavedProgress = -1
    lastSavedAt = 0
    const state = recordLearningPageVisit(readLearningState(), currentPage)
    saveLearningState(state)
    dispatchLearningProgressUpdated()
    restoreResumePosition()
  }

  function getScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  }

  function saveProgress(options = {}) {
    if (!currentPath) return
    const now = Date.now()
    const progress = Math.round(getScrollProgress())
    if (progress <= 0 && lastSavedProgress < 0) return
    const shouldSave =
      options.force ||
      progress >= 92 ||
      Math.abs(progress - lastSavedProgress) >= 3 ||
      now - lastSavedAt > 2500

    if (!shouldSave) return

    const state = recordLearningPageProgress(readLearningState(), {
      path: currentPath,
      progress,
      now
    })

    saveLearningState(state)
    dispatchLearningProgressUpdated()
    lastSavedProgress = progress
    lastSavedAt = now
  }

  function shouldResumeScroll() {
    if (typeof window === 'undefined') return false
    return new window.URLSearchParams(window.location.search).get(LEARNING_RESUME_PARAM) === '1'
  }

  function restoreResumePosition() {
    if (!currentPath || !shouldResumeScroll() || resumePending) return
    const progress = getLearningPageProgress(readLearningState(), currentPath)
    if (progress <= 5) return

    resumePending = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - document.documentElement.clientHeight
        if (maxScroll > 0) {
          window.scrollTo({
            top: Math.round(maxScroll * (progress / 100)),
            behavior: 'auto'
          })
        }
        resumePending = false
      })
    })
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      saveProgress()
    })
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') saveProgress({ force: true })
  }

  function cleanup() {
    saveProgress({ force: true })
    window.removeEventListener('scroll', onScroll)
    if (beforeUnloadHandler) window.removeEventListener('beforeunload', beforeUnloadHandler)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (routeChangeHandler && router.onBeforeRouteChange === routeChangeHandler) {
      router.onBeforeRouteChange = previousBeforeRouteChange
    }
    if (activeTrackerCleanup === cleanup) activeTrackerCleanup = null
  }

  onMounted(() => {
    recordVisit()
    window.addEventListener('scroll', onScroll, { passive: true })
    beforeUnloadHandler = () => saveProgress({ force: true })
    window.addEventListener('beforeunload', beforeUnloadHandler)
    document.addEventListener('visibilitychange', onVisibilityChange)

    previousBeforeRouteChange = router.onBeforeRouteChange
    routeChangeHandler = async (to) => {
      saveProgress({ force: true })
      return previousBeforeRouteChange?.(to)
    }
    router.onBeforeRouteChange = routeChangeHandler
    activeTrackerCleanup = cleanup
  })

  onContentUpdated(() => {
    recordVisit()
  })

  onUnmounted(() => {
    cleanup()
  })
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    activeTrackerCleanup?.()
  })
}
