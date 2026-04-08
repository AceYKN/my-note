import { onMounted, onUnmounted } from 'vue'

/**
 * Custom scrollspy for the 960–1279px range where VitePress forces the aside
 * visible via CSS but its internal useActiveAnchor skips (isAsideEnabled is
 * false unless width >= 1280px with a sidebar).
 *
 * At 1280px+ VitePress's built-in handles it; we do nothing to avoid conflicts.
 */
export function useOutlineScrollSpy() {
  let cleanup = null

  function run() {
    // Only operate in the custom range (960–1279px)
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

    cleanup = () => window.removeEventListener('scroll', throttled)
  }

  onMounted(() => {
    // Give VitePress time to render the aside
    requestAnimationFrame(run)
  })

  onUnmounted(() => {
    cleanup?.()
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
