
# my-note

> 本仓库已停止维护，全部学习笔记已迁移至 [AceYKN/blog](https://github.com/AceYKN/blog)。

## 新地址

<https://aceykn-blog.pages.dev/library>

旧 GitHub Pages 页面会保留原路径并自动跳转到新站，例如 `/my-note/cs/os/note/chap2.html` 会跳转到 `/notes/cs/os/note/chap2`。

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run docs:dev

# 构建静态站点
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。
