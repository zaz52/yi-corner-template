# 我的小世界 · 可玩的 3D 个人网站模板

别人的个人网站是拿来看的，这个是拿来玩的：打开就能开着小红车到处逛，
逛你的小店、影院、博客和收藏，全部网站都在一张 3D 地图里。

操作：WASD / 方向键驾驶，空格跳跃，R 回到道路，M 地图，E 互动。

## 快速开始

```bash
npm run build
```

构建时会先从 Bruno Simon Folio 2025 仓库下载场景资源（需联网），
再校验网站目录、打包，产物在 `dist/world/`，直接扔到任何静态托管
（Cloudflare Pages、Vercel、Netlify、GitHub Pages）就能访问。

首次构建后本地预览：`cd world && npm run dev`。

## 改成你自己的（4 处）

1. **网站目录**：`world/sources/data/site-catalog.json`，把 7 条示例换成你自己的站。
   字段：`id`（唯一）、`title`（中文标题）、`url`（https 链接）、`description`、
   `category`（分类）、`mine`（是不是自己的）、`source`。
2. **联系方式**：`world/sources/data/site-contacts.json`，换成你自己的主页链接。
3. **顶部菜单和招牌**：`world/sources/Game/YiCorner.js`，
   `ui()` 里的菜单按钮、`shop()` / `cinema()` 里的招牌文字。
4. **标题和描述**：`world/sources/index.html` 的 `<title>` 和 description。

## 进阶改法

- **加一个传送门建筑**：在 `YiCorner.js` 里照着 `shop()` / `cinema()` 写一栋建筑，
  再用 `this.portal('你的目录 id', x, z)` 放一个传送圈。
- **目录分类**：`YiCorner.js` 开头的 `directoryBoard('分类名', x, z)` 决定了
  3D 世界里有几块分类看板，分类名要和目录里的 `category` 对上。
- **时光机彩蛋链接**：`world/sources/Game/World/Areas/TimeMachineArea.js`，
  默认指向 `https://example.com`，换成你自己的旧站或任意链接。
- **校验**：每次构建都会跑 `world/scripts/check-sites.mjs`，
  检查目录 id 不重复、链接不重复、标题是中文、搜索和分类能用。

## 目录结构

```
scripts/build-world.mjs   构建脚本：下载场景资源 → 校验目录 → 打包 → 输出 dist/world
world/sources/            3D 世界源码（Three.js + 游戏逻辑）
world/sources/data/       网站目录、联系方式、翻译
world/asset-manifest.json 场景资源清单（构建时下载，不用手动放）
```

## 来源与许可

场景与驾驶系统基于 [Bruno Simon Folio 2025](https://github.com/brunosimon/folio-2025)，
MIT 许可，构建时下载的场景资源同样出自该仓库。其余部分可自由使用、修改和分享。
