import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import CategoryIndex from '../components/CategoryIndex.vue'
import StatsDisplay from '../components/StatsDisplay.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import { setupTableWrapper } from './tableWrapper.js'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app, router }) {
    app.component('CategoryIndex', CategoryIndex)
    app.component('StatsDisplay', StatsDisplay)
    app.component('ReadingProgress', ReadingProgress)
    app.component('BackToTop', BackToTop)
    app.component('Breadcrumb', Breadcrumb)

    // 路由变化时重新包装表格（含首次加载）
    if (typeof window !== 'undefined') {
      // 首次加载
      setupTableWrapper()
      // 路由切换后重新执行
      router.onAfterRouteChanged = () => {
        setTimeout(setupTableWrapper, 100)
      }
    }
  }
}