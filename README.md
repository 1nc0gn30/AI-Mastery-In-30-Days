# AI Mastery in 30 Days

Open-access 30-day developer curriculum and client-side AI engineering workbench covering LLM fundamentals, structured prompting, multimodal tooling, RAG pipelines, Model Context Protocol (MCP), autonomous agents, local Ollama inference, and OWASP LLM security.

- **Live Site:** [https://ai-mastery.nealfrazier.tech/](https://ai-mastery.nealfrazier.tech/)
- **Repository:** [https://github.com/1nc0gn30/AI-Mastery-In-30-Days](https://github.com/1nc0gn30/AI-Mastery-In-30-Days)
- **Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4
- **Access Model:** 100% free and unlocked — zero accounts, paywalls, or backend API keys required

## What Is Included

1. **30 Structured Daily Modules** (`src/data/curriculum.ts`)
   - Four tracks: `Foundations`, `Multimodal`, `Advanced`, and `Agents & Security`.
   - Search by keyword/tag, filter by category or completion state, deep-link directly via `?day=N`, and navigate via `Alt+Left` / `Alt+Right`.
   - Progress, quiz pass history, and per-day study notes persist locally in `localStorage` and export to a single Markdown study log (`.md`).
2. **Per-Day Knowledge Checks** (`src/data/quizzes.ts`)
   - 30 targeted engineering multiple-choice questions with concrete technical explanations and instant feedback.
3. **Interactive Client-Side AI Lab** (`src/components/InteractiveLab.tsx` + `src/lib/aiLabEngine.ts`)
   - **Prompt Builder & Linter:** Structured P.C.T.F. composer with Zero-Shot, Few-Shot, Chain-of-Thought, Tree-of-Thoughts, and ReAct templates plus static quality scoring and cliché detection.
   - **Token, Cost & VRAM Lab:** Deterministic BPE-style subword boundary inspector, 30-day API cost calculator across leading cloud & local models, and Ollama GGUF VRAM estimator (`Q4` / `Q8` / `FP16`).
   - **RAG Chunk & Retrieval Simulator:** Adjustable chunk size/overlap splitter with live in-browser TF-IDF cosine similarity ranking.
   - **Prompt Injection Red-Team Lab:** OWASP LLM01 static analyzer for direct overrides, delimiter breakouts, roleplay jailbreaks, and secret/PII leaks with XML-delimited hardened prompt generation.

## Local Development

### Prerequisites
- Node.js 22+
- npm 10+

### Install & Run
```bash
npm install
npm run dev
```
The dev server starts at `http://localhost:3000`.

### Verify (Typecheck, Unit Tests, Production Build)
```bash
npm run lint
npm test
npm run build
npm run preview
```

## Deployment (Netlify)
- Configuration is managed in [`netlify.toml`](./netlify.toml) (`command = "npm run build"`, `publish = "dist"`, security headers, and SPA catch-all redirect).
- SEO/AEO assets live in `index.html` (`WebApplication`, `Course`, and `FAQPage` JSON-LD `@graph`), `public/robots.txt`, `public/sitemap.xml`, and `public/og-card.png`.

## Attribution & Support
Engineered by **Neal Frazier Tech (@1nc0gn30)** • [NullAI Platform](https://nullai.tech).

If this curriculum helps your team or study group, optional support is available via [Buy Us a Coffee](https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X).
