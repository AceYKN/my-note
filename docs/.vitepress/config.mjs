import { defineConfig } from 'vitepress'
import markdownItMathjax3 from 'markdown-it-mathjax3' // 1. 改引入

export default defineConfig({
  title: "我的学习笔记",
  description: "分类整理的 Markdown 笔记库",

  // 2. 注意：这里不需要 head 引入 CSS 了

  // ... 前面的代码不变
    themeConfig: {
      // 1. 顶部导航栏 (一级分类)
      nav: [
        { text: '🏠 首页', link: '/' },
        { text: '➗ 数学笔记', link: '/math/calculus' },
        { text: '💻 编程笔记', link: '/code/cpp-start' } // 新增这一行
      ],

      // 2. 左侧侧边栏 (二级/三级目录)
      sidebar: {
        // 当用户在 /math/ 目录下时，显示这个侧边栏
        '/math/': [
          {
            text: '高等数学',
            collapsed: false, // 是否默认展开
            items: [
              { text: '微积分基础', link: '/math/calculus' },
              { text: '线性代数', link: '/math/linear-algebra' } // 如果文件不存在，点击会404，记得创建文件
            ]
          }
        ],

        // 当用户在 /code/ 目录下时，显示这个侧边栏
        '/code/': [
          {
            text: 'C/C++ 语言',
            items: [
              { text: '入门基础', link: '/code/cpp-start' }
            ]
          },
          {
            text: '其他语言',
            collapsed: true, // 默认折叠起来
            items: [
              { text: 'Go 语言笔记', link: '/code/go-notes' }
            ]
          }
        ]
      },

      // 3. 社交链接
      socialLinks: [
        { icon: 'github', link: 'https://github.com/AceYKN/my-note' }
      ]
    },
    // ... 后面的代码不变

  markdown: {
    config: (md) => {
      md.use(markdownItMathjax3) // 3. 改用 Mathjax3
    }
  }
})