import { onMounted, onUnmounted } from 'vue'
import { onContentUpdated } from 'vitepress'

/**
 * Custom scrollspy for the 960–1279px range where VitePress forces the aside
 * visible via CSS but its internal useActiveAnchor skips (isAsideEnabled is
 * false unless width >= 1280px with a sidebar).
 *
 * At 1280px+ VitePress's built-in handles it; we only add container auto-scroll
 * via MutationObserver to keep the active TOC link visible.
 *
 * Uses onContentUpdated (route-change hook) for reliable re-initialization
 * instead of a fragile listObserver approach.
 */
export function useOutlineScrollSpy() {
  let scrollContainer = null
  let linkObserver = null
  let cleanupScrollSpy = null

  // ── Helpers ──────────────────────────────────────────────────────────────

  function scrollToActive(link) {
    if (!scrollContainer) return
    const linkTop = link.getBoundingClientRect().top
    const cTop = scrollContainer.getBoundingClientRect().top
    const cBottom = scrollContainer.getBoundingClientRect().bottom
    // padding-top accounts for the fixed nav bar; content is hidden below it
    const paddingTop = parseFloat(getComputedStyle(scrollContainer).paddingTop) || 0
    const visibleTop = cTop + paddingTop
    if (linkTop < visibleTop + 8) {
      scrollContainer.scrollBy({ top: linkTop - visibleTop - 8, behavior: 'smooth' })
    } else if (linkTop > cBottom - 48) {
      scrollContainer.scrollBy({ top: linkTop - cBottom + 48, behavior: 'smooth' })
    }
  }

  // ── Universal: auto-scroll .aside-container to keep active link visible ──
  function setupContainerScroll() {
    scrollContainer = document.querySelector('.aside-container')
    if (!scrollContainer) return

    if (linkObserver) linkObserver.disconnect()

    linkObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          mutation.target.classList.contains('active')
        ) {
          scrollToActive(mutation.target)
          break
        }
      }
    })

    attachLinkObserver()
  }

  /** Re-observe all current outline links — called on mount and content updates */
  function attachLinkObserver() {
    if (!linkObserver) return
    const outline = document.querySelector('.VPDocAsideOutline')
    if (!outline) return
    linkObserver.disconnect()
    outline.querySelectorAll('a').forEach(a => {
      linkObserver.observe(a, { attributes: true, attributeFilter: ['class'] })
    })
  }

  // ── 960–1279px only: custom scroll spy (VitePress built-in is disabled) ──

  /** Activates the correct TOC link based on current scroll position */
  function triggerScrollSpy() {
    if (!window.matchMedia('(min-width: 960px) and (max-width: 1279px)').matches) return

    const container = document.querySelector('.VPDocAsideOutline')
    const marker = document.querySelector('.VPDocAsideOutline .outline-marker')
    if (!container || !marker) return

    // Read current active link from DOM to avoid stale closure reference
    let prevLink = container.querySelector('a.active') || null

    function getScrollOffset() {
      const nav = document.querySelector('.VPNav')
      if (!nav) return 0
      const bot = nav.getBoundingClientRect().bottom
      return bot > 0 ? bot + 24 : 0
    }

    function activateLink(hash) {
      if (prevLink) prevLink.classList.remove('active')
      if (!hash) {
        prevLink = null
        marker.style.opacity = '0'
        return
      }
      const link = container.querySelector(`a[href="${hash}"]`)
      if (!link) {
        marker.style.opacity = '0'
        return
      }
      link.classList.add('active')
      marker.style.top = link.offsetTop + 39 + 'px'
      marker.style.opacity = '1'
      prevLink = link
    }

    function onScroll() {
      const scrollY = window.scrollY
      const offset = getScrollOffset()

      if (scrollY < 1) {
        activateLink(null)
        return
      }

      const headings = [...document.querySelectorAll('.vp-doc :where(h1,h2,h3,h4,h5,h6)')]
        .filter(el => el.id)

      if (!headings.length) return

      const isBottom =
        Math.abs(scrollY + window.innerHeight - document.body.offsetHeight) < 1

      if (isBottom) {
        activateLink('#' + headings[headings.length - 1].id)
        return
      }

      let activeHash = null
      for (const el of headings) {
        let top = 0
        let node = el
        while (node && node !== document.body) {
          top += node.offsetTop
          node = node.offsetParent
        }
        if (top > scrollY + offset + 4) break
        activeHash = '#' + el.id
      }
      activateLink(activeHash)
    }

    // Replace existing scroll listener with a fresh one
    if (cleanupScrollSpy) {
      cleanupScrollSpy()
      cleanupScrollSpy = null
    }

    const throttled = throttle(onScroll, 100)
    window.addEventListener('scroll', throttled, { passive: true })
    // Immediately resolve active link for the current scroll position
    requestAnimationFrame(onScroll)

    cleanupScrollSpy = () => window.removeEventListener('scroll', throttled)
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  onMounted(() => {
    requestAnimationFrame(() => {
      setupContainerScroll()
      triggerScrollSpy()
    })
  })

  // Re-initialize on every route change (content update)
  onContentUpdated(() => {
    requestAnimationFrame(() => {
      // Re-observe new links rendered for the new page
      attachLinkObserver()
      // Reset and re-run scroll spy so initial heading is highlighted
      triggerScrollSpy()
    })
  })

  onUnmounted(() => {
    cleanupScrollSpy?.()
    linkObserver?.disconnect()
  })
}


function throttle(fn, wait) {
  let timer = null
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, wait)
  }
}
