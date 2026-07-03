# usedare.github.io

个人 GitHub Pages 网站与创新实验三 Jekyll 专题页面。

## 实验三对应内容

- 个人博客：`_posts/`
- 公共布局：`_layouts/default.html`
- 首页展示：`index.html`
- 实验专题页：`topics/jekyll-experiment.md`
- 样式与脚本：`assets/css/style.css`、`assets/js/main.js`

## 本地运行

本仓库提供 Docker 运行方式，适合未安装 Ruby 的 Windows 环境：

```bash
docker compose up --build
```

启动后访问：

```text
http://localhost:4000
http://localhost:4000/topics/jekyll-experiment/
```

如果本机已经安装 Ruby：

```bash
bundle install
bundle exec jekyll serve
```

## 部署

仓库名为 `usedare.github.io`，推送到 GitHub 后可通过 GitHub Pages 发布到：

```text
https://usedare.github.io
```

## 实验截图建议

1. 代码截图：`_config.yml`、`_layouts/default.html`、`_posts/`、`topics/jekyll-experiment.md`。
2. 命令行截图：`docker compose up --build` 成功启动 Jekyll。
3. 网页截图：首页、博客文章页、实验专题页。
4. 仓库截图：GitHub 文件列表、提交记录、Pages 访问地址。
