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
    
    // 路由变化时重新包装表格
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        setTimeout(setupTableWrapper, 100)
      }
    }
  },
  setup() {
    // 初始化表格包装器
    if (typeof window !== 'undefined') {
      import('./tableWrapper.js').then(({ setupTableWrapper }) => {
        setupTableWrapper()
      })
    }
  }
}