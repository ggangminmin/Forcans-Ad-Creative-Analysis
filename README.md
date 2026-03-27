# Forcans Ad Creative Analysis

AI-based ad creative analysis and generation app built with Next.js.

## Local Run

```bash
npm run dev:node20
```

Open `http://localhost:3000/ad-creative`.

## Vercel Deploy

1. Push to GitHub `main`.
2. Import the repo in Vercel.
3. Add environment variables:
   - `VITE_OPENAI_API_KEY`
   - `VITE_TAVILY_API_KEY`
   - `VITE_GEMINI_API_KEY`

Root path `/` is redirected to `/ad-creative` via `vercel.json`.
