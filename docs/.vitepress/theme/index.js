import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import './liquid-glass.css'
import CategoryIndex from '../components/CategoryIndex.vue'
import StatsDisplay from '../components/StatsDisplay.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
import SeasonBadge from '../components/SeasonBadge.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('CategoryIndex', CategoryIndex)
    app.component('StatsDisplay', StatsDisplay)
    app.component('ReadingProgress', ReadingProgress)
    app.component('BackToTop', BackToTop)
    app.component('Breadcrumb', Breadcrumb)
    app.component('SeasonBadge', SeasonBadge)
  }
}