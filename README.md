![banner](github_banner.png)

# LifeGrid

> **Premium Dynamic Wallpapers for iOS and Android Lock Screens.**
>
> 极简美学，数据驱动。为您的手机锁屏打造的高精度动态壁纸。

<p align="center">
  <a href="#english">English</a> | <a href="#chinese">中文</a>
</p>

---

<div id="english"></div>

## 🌟 Introduction

LifeGrid generates high-resolution, data-driven wallpapers that help you visualize your time, goals, and life progress directly on your iPhone or Android lock screen. Designed to sit perfectly between the time, widgets, and dynamic island.

**[🌐 Live Demo (PLACEHOLDER)](PLACEHOLDER)**

## ✨ Features

- **Dynamic Visuals**
  - **Year Progress**: 365 dots representing every day of the year. Active day highlighted.
  - **Life Calendar**: Every week of your life (up to 80+ years) in a single grid.
  - **Goal Countdown**: Circular progress tracker for your biggest targets.

- **Pixel-Perfect**
  - Native resolution generation for all modern iPhones (13 mini to 16 Pro Max).
  - Smart layout adjustments for Notch vs Dynamic Island devices.
  - Retina-quality live previews (+10% contrast boost filter).

- **Architecture**
  - **Privacy First**: No database, no tracking. Your data is encoded in the URL.
  - **Performance**: Serverless Cloudflare Worker with Rust-based SVG rendering (`resvg`).
  - **Security**: Strict Zod schema validation.

## 📸 Screenshots

|   |   |
|:---:|:---:|
| <img src="screenshots/IMG_7398.PNG" width="280"> | <img src="screenshots/IMG_7399.PNG" width="280"> |
| <img src="screenshots/IMG_7400.PNG" width="280"> | <img src="screenshots/IMG_7401.PNG" width="280"> |

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Cloudflare Wrangler CLI (`npm install -g wrangler`)

### Backend Setup (Cloudflare Worker)

```bash
cd worker
npm install
npx wrangler dev
# Deploy: npx wrangler deploy
```

### Frontend Setup

The frontend is a static site. You can serve it with any static file server.

```bash
# From project root
npx serve .
```

Open `http://localhost:3000` to see the wallpaper generator.

## 📱 Usage

### iOS Shortcut
1. Copy your generated URL from the web app.
2. Open **Shortcuts** app.
3. Create New Shortcut: `Get Contents of URL` → `Set Wallpaper` (Lock Screen).
4. Automate to run daily at 6 AM.

### Android Setup
1. Use **MacroDroid**.
2. Trigger: Daily at 00:01.
3. Action: HTTP GET (Save to `/Download/lifegrid.png`) → Set Wallpaper.

---

<div id="chinese"></div>

## 🌟 简介

LifeGrid 生成高分辨率的数据驱动壁纸，帮助你在 iPhone 或 Android 锁屏上直接可视化你的时间、目标和人生进度。它的设计完美融合了锁屏时间、小组件和灵动岛的布局。

**[🌐 在线演示 (PLACEHOLDER)](PLACEHOLDER)**

## ✨ 特性

- **动态可视化**
  - **年度进度**: 365 个点代表一年的每一天，当前日期高亮显示。
  - **人生日历**: 在一个网格中概览你人生（80+ 年）的每一个星期。
  - **目标倒数**: 核心目标的环形进度追踪。

- **像素级完美**
  - 针对现代 iPhone (13 mini 到 16 Pro Max) 的原生分辨率生成。
  - 智能适应“刘海屏”与“灵动岛”布局。
  - Retina 级实时预览（增强对比度滤镜）。

- **架构设计**
  - **隐私至上**: 无数据库，无追踪。所有状态数据均编码在 URL 中。
  - **极致性能**: 基于 Serverless Cloudflare Worker 和 Rust (`resvg`) 的 SVG 渲染。
  - **安全可靠**: 严格的 Zod 模式验证。

## 📸 截图预览

| 年度进度 | 人生日历 |
|:---:|:---:|
| <img src="screenshots/IMG_7398.PNG" width="280"> | <img src="screenshots/IMG_7399.PNG" width="280"> |
| <img src="screenshots/IMG_7400.PNG" width="280"> | <img src="screenshots/IMG_7401.PNG" width="280"> |

## 🛠 技术栈

HTML5, CSS3, Vanilla JavaScript, Cloudflare Workers, Rust (Resvg), Zod.

## 🚀 快速开始

### 环境要求
- Node.js & npm
- Cloudflare Wrangler CLI (`npm install -g wrangler`)

### 后端设置 (Cloudflare Worker)
```bash
cd worker
npm install
npx wrangler dev
# 部署: npx wrangler deploy
```

### 前端设置
不管是 `http-server` 还是 `serve` 或者是 VS Code Live Server，任何静态服务器皆可。
```bash
npx serve .
```
访问 `http://localhost:3000` 即可看到生成器。

## 📱 使用指南

### iOS 捷径 (Shortcuts)
1. 在网页上配置好并复制生成的 URL。
2. 打开 **快捷指令 (Shortcuts)** App。
3. 新建快捷指令: `获取 URL 内容` → `设定墙纸` (锁定屏幕)。
4. 设置自动化: 每天早上 6 点运行。

### Android 设置
1. 推荐使用 **MacroDroid**。
2. 触发器: 每天 00:01。
3. 动作: HTTP GET (保存为 `/Download/lifegrid.png`) → 设置壁纸。

---

## ❤️ Credits & Acknowledgements

This project stands on the shoulders of giants.
Special thanks to the original open-source contributor:

**[aradhyacp](https://github.com/aradhyacp)** - *For the original concept and codebase inspiration.*

Made with ❤️ for mindful living.
Copyright © 2026 daftAI.
