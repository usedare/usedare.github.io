---
layout: default
title: "Jekyll 实验记录：从 Markdown 到 GitHub Pages"
date: 2026-07-03
categories: [Jekyll, GitHub-Pages, 实验记录]
permalink: /blog/jekyll-lab-notes/
---

本次实验的目标是把个人主页整理成一个可维护的 Jekyll 静态网站，并记录从本地运行到发布的完整过程。相比手写单个 HTML 文件，Jekyll 的价值在于把内容、布局和配置分离：文章放在 `_posts`，公共结构放在 `_layouts`，站点信息集中在 `_config.yml`。

## 项目结构

```text
usedare.github.io
├── _config.yml          # 站点标题、链接、插件和永久链接规则
├── _layouts/default.html# 博客文章和专题页面共用布局
├── _posts/              # Markdown 博客文章
├── assets/              # CSS、JavaScript、图片和动画资源
├── topics/              # 实验专题页面
├── Dockerfile           # Jekyll 本地运行环境
└── docker-compose.yml   # 一键启动本地服务
```

## 本地运行命令

由于 Windows 主机未安装 Ruby，本项目使用 Docker 复现实验环境：

```bash
docker compose up --build
```

服务启动后访问 `http://localhost:4000`，Jekyll 会读取 Markdown 和 Liquid 模板，生成可浏览的静态页面。修改文章或样式后刷新浏览器即可查看结果。

## 页面发布流程

1. 在本地完成内容编辑，包括首页入口、专题页和博客文章。
2. 使用 `git status` 检查改动文件，确认没有无关临时文件。
3. 提交代码并推送到 GitHub 仓库 `usedare/usedare.github.io`。
4. GitHub Pages 根据仓库内容构建站点，最终访问地址为 `https://usedare.github.io`。

## 调试记录

实验中最重要的调试点是路径。站点部署到根域名时，资源可以使用 `/assets/...`；如果部署到项目子路径，则应使用 Liquid 的 `relative_url` 过滤器。本项目在模板中使用 `{{ '/topics/jekyll-experiment/' | relative_url }}` 这类写法，以便迁移时减少路径错误。

## 收获

Jekyll 适合课程博客、项目档案、文档站和个人主页。它把内容写作变成主要工作，把重复的导航、页脚、文章列表交给模板处理，既保留了静态站点的简单可靠，也让后续维护更清晰。
