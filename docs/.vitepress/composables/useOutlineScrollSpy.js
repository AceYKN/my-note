import { onMounted, onUnmounted } from 'vue'

/**
 * Custom scrollspy for the 960–1279px range where VitePress forces the aside
 * visible via CSS but its internal useActiveAnchor skips (isAsideEnabled is
 * false unless width >= 1280px with a sidebar).
 *
 * At 1280px+ VitePress's built-in handles it; we only add container auto-scroll
 * via MutationObserver to keep the active TOC link visible.
 */
export function useOutlineScrollSpy() {
  let cleanupScrollSpy = null
  let cleanupObserver = null

  // ── Universal: auto-scroll .aside-container to keep active link visible ──
  function setupContainerScroll() {
    const scrollContainer = document.querySelector('.aside-container')
    const outline = document.querySelector('.VPDocAsideOutline')
    if (!scrollContainer || !outline) return

    function scrollToActive(link) {
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

    const observer = new MutationObserver((mutations) => {
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

    // Observe all outline links for class changes
    outline.querySelectorAll('a').forEach(a => {
      observer.observe(a, { attributes: true, attributeFilter: ['class'] })
    })

    // Re-attach when the outline re-renders (route change)
    const listObserver = new MutationObserver(() => {
      observer.disconnect()
      outline.querySelectorAll('a').forEach(a => {
        observer.observe(a, { attributes: true, attributeFilter: ['class'] })
      })
    })
    listObserver.observe(outline, { childList: true, subtree: true })

    cleanupObserver = () => {
      observer.disconnect()
      listObserver.disconnect()
    }
  }

  // ── 960–1279px only: custom scroll spy (VitePress built-in is disabled) ──
  function runScrollSpy() {
    if (!window.matchMedia('(min-width: 960px) and (max-width: 1279px)').matches) {
      return
    }

    const container = document.querySelector('.VPDocAsideOutline')
    const marker = document.querySelector('.VPDocAsideOutline .outline-marker')
    if (!container || !marker) return

    let prevLink = null

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

      const isBottom =
        Math.abs(scrollY + window.innerHeight - document.body.offsetHeight) < 1

      if (!headings.length) return

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

    const throttled = throttle(onScroll, 100)
    window.addEventListener('scroll', throttled, { passive: true })
    requestAnimationFrame(onScroll)

    cleanupScrollSpy = () => window.removeEventListener('scroll', throttled)
  }

  onMounted(() => {
    requestAnimationFrame(() => {
      setupContainerScroll()
      runScrollSpy()
    })
  })

  onUnmounted(() => {
    cleanupScrollSpy?.()
    cleanupObserver?.()
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
