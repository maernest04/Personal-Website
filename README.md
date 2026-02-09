# Mahjong Portfolio — Ernest Ma

An interactive Hong Kong-style mahjong-themed personal portfolio website. Visitors experience the site as if sitting at a mahjong table — drawing tiles to explore different sections of my portfolio.

## Features

- **3D Mahjong Table**: Built with React Three Fiber, featuring a full table with wall tiles, green felt surface, and wood border
- **Interactive Tile Drawing**: Click tiles from the wall to reveal portfolio sections with satisfying 3D flip animations
- **6 Portfolio Sections**: About, Skills, Projects, Experience, Contact, Education — each mapped to a mahjong tile suit
- **Faan Counter**: Gamified exploration tracking using HK mahjong's scoring system
- **Procedural Audio**: Web Audio API-generated tile click, slam, shuffle, and win sounds
- **Easter Eggs**: Type "sikwu" for a surprise, explore all sections for the Thirteen Orphans achievement
- **Loading Screen**: Animated tile shuffle sequence
- **Responsive Design**: Full 3D on desktop, optimized layouts on mobile

## Tech Stack

- **Next.js 16** (App Router)
- **React Three Fiber** + **Drei** (3D rendering)
- **Framer Motion** (2D animations)
- **Tailwind CSS v4** (styling)
- **TypeScript** (type safety)
- **Web Audio API** (procedural sound effects)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tile-to-Section Mapping

| Suit | Chinese | Section | Color |
|------|---------|---------|-------|
| Characters (萬子) | 一萬 | About Me | Red |
| Dots (筒子) | 五筒 | Skills | Blue |
| Bamboo (索子) | 三索 | Projects | Green |
| Winds (風牌) | 東風 | Experience | Purple |
| Dragons (三元牌) | 紅中 | Contact | Red |
| Flowers (花牌) | 花 | Education | Orange |

## Build

```bash
npm run build
npm start
```

## Deploy

Optimized for Vercel deployment:

```bash
npx vercel
```
