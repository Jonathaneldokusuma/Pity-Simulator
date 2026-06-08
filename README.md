# Pity Simulator

A Vercel-ready gacha pity simulator built with React, TypeScript, and Vite.

## Features

- Game presets for popular gacha-style banners
- Fully editable custom banner rules for any game
- Character image URL field for banner art and 5-star result cards
- 1 pull, 10 pulls, and pull-until-featured simulation
- 5-star pity, 4-star pity, soft pity, hard pity, and guarantee tracking
- Session stats, currency spend, latest results, and pull history
- Static frontend deployment with Vercel

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy To Vercel

Use these settings if Vercel asks:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

This repo also includes `vercel.json`, so Vercel should detect the right build settings automatically.

## Push To Your GitHub Repo

```bash
git init
git remote add origin https://github.com/Jonathaneldokusuma/Pity-Simulator.git
git add .
git commit -m "Build pity simulator"
git branch -M main
git push -u origin main
```
