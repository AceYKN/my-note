/**
 * 表格包装器 - 自动为表格添加滚动容器
 * 在 markdown 文件中使用表格时自动应用
 */

export function setupTableWrapper() {
  if (typeof window === 'undefined') return

  const wrapTables = () => {
    const tables = document.querySelectorAll('.vp-doc table:not(.wrapped)')
    
    tables.forEach(table => {
      // 检查是否已被包装
      if (table.parentElement?.classList.contains('table-container')) {
        table.classList.add('wrapped')
        return
      }
      
      // 创建包装容器
      const wrapper = document.createElement('div')
      wrapper.className = 'table-container'
      
      // 插入包装器
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
      table.classList.add('wrapped')
    })
  }

  // 初始化
  wrapTables()
  
  // 监听内容变化
  const observer = new MutationObserver(wrapTables)
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
