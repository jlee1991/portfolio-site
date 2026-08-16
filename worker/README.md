# Portfolio chat backend

A small Cloudflare Worker that gives the site's chatbot a real LLM (Claude
Haiku) instead of pure keyword matching. If this Worker is unreachable, over
budget, or not deployed at all, the site silently falls back to the original
local keyword-matched answers in `index.html` — the chat never breaks.

## What's in here

- `src/index.js` — the Worker. Handles CORS, rate limiting, the Anthropic API
  call, and a monthly request budget stored in Cloudflare KV.
- `src/facts.js` — the grounding text (your real background) fed to the model
  as a system prompt, so it only ever answers from real facts.
- `wrangler.toml` — Worker config; needs a real KV namespace id (step 4 below).

## Cost safety (read this first)

There are two layers:

1. **The real guarantee — Anthropic Console spend limit.** This is the only
   layer that can't be bypassed by a bug or a determined visitor. **Set this
   before deploying.**
2. **Defense in depth — the Worker's own limits.** 400 requests/month total,
   5/minute and 20/day per visitor IP, and a 250-token cap on every response.
   Even at generous pricing assumptions this keeps normal usage a small
   fraction of $5/month; the Console limit is what makes it a hard ceiling
   regardless.

## One-time setup (steps only you can do — account/billing actions)

**1. Get an Anthropic API key**
Go to [console.anthropic.com](https://console.anthropic.com) → API Keys →
Create Key. Copy it somewhere safe for a moment (step 5 needs it).

**2. Set a $5/month hard spend limit**
In the Anthropic Console: Settings → Limits (or Billing → Usage Limits) →
set a monthly spend cap of **$5**. Once hit, the API simply stops responding
with an error — it cannot bill you past this no matter what happens on the
Worker side.

**3. Create a free Cloudflare account**
[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) — the
Workers free plan needs no credit card and covers this easily (100k
requests/day free tier; you'll use a few hundred a month at most).

**4. Log in and create the KV namespace**
From this `worker/` directory:
```bash
npx wrangler login
```
This opens your browser for Cloudflare auth — nothing to paste. Then:
```bash
npx wrangler kv namespace create CHAT_KV
```
It prints an `id = "..."`. Open `wrangler.toml` and replace
`REPLACE_WITH_KV_NAMESPACE_ID` with that id.

**5. Set the API key as a Worker secret**
```bash
npx wrangler secret put ANTHROPIC_API_KEY
```
Paste your key when it prompts — this goes straight to Cloudflare, never
into a file in this repo or into any chat.

**6. Deploy**
```bash
npx wrangler deploy
```
This prints your live URL, something like:
`https://jim-portfolio-chat.<your-subdomain>.workers.dev`

**7. Wire it into the site**
In `index.html`, find `const CHAT_WORKER_URL = '';` and put that URL between
the quotes. Commit and push as usual.

## Testing locally before deploying

```bash
npx wrangler dev
```
Runs the Worker on `localhost:8787` (still calls the real Anthropic API and
counts against your budget). Point `CHAT_WORKER_URL` at that during testing,
then swap to the deployed URL before pushing.

## Updating the facts

Edit `src/facts.js`, then `npx wrangler deploy` again. This is the only
place the model's knowledge lives — it won't say anything not in that file.
