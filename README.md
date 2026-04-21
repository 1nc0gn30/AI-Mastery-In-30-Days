# AI Mastery in 30 Days

A guided 30-day AI learning platform focused on tools, prompting, agents, and applied workflows.

## Snapshot
- Canonical URL: `https://ai-mastery.nealfrazier.tech/`
- Author: `Neal Frazier`
- Stack: `React 19 + TypeScript + Vite 6 + Tailwind CSS 4`
- Deployment target: `Netlify`

## What This Site Delivers
- Day-by-day AI learning roadmap
- Practical implementation-oriented curriculum
- AI-enhanced user journey with Gemini-backed integration

## Local Development
### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
cp .env.example .env.local
```

Add your key in `.env.local`:
```env
GEMINI_API_KEY="your_key_here"
```

### Run
```bash
npm run dev
```
App runs on `http://localhost:3000`.

## Build and Quality
```bash
npm run lint
npm run build
npm run preview
```

## Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `public/_redirects`

## SEO Baseline
- Canonical and social URLs point to: `https://ai-mastery.nealfrazier.tech/`
- Crawl artifacts (`robots.txt`, `sitemap.xml`) target the same host

## Project Layout
```text
src/
public/
index.html
vite.config.ts
```
