# Weekly traffic report

A Cloudflare Worker with its own weekly Cron Trigger (Mondays, 13:00 UTC —
same schedule as the old Claude Code routine). It fetches real stats from
GoatCounter's official API and emails a summary directly, via Resend.

This exists because the Claude Code scheduled-routine approach **cannot**
work for this: those routines run in a sandbox with a fixed network
allowlist that excludes arbitrary sites like goatcounter.com, with no way
to add domains to it. Cloudflare Workers have normal outbound internet
access, so the fetch step that kept failing there just works here.

## What it does

Every Monday at 13:00 UTC:
1. Calls GoatCounter's `/api/v0/stats/total`, `/stats/hits`, and
   `/stats/toprefs` endpoints for the last 7 days (and the prior 7 days,
   for a week-over-week comparison).
2. Formats a short plain-text summary: total visits, trend vs. last week,
   top 5 pages, top 5 referrers.
3. Sends it via Resend to jim.lee.nj@gmail.com.
4. If anything fails (bad token, GoatCounter down, etc.), sends a fallback
   email explaining what broke instead of failing silently.

## One-time setup (steps only you can do)

**1. Get a GoatCounter API key**
Sign in at [jim-portfolio.goatcounter.com](https://jim-portfolio.goatcounter.com)
→ your username (top right) → **API** → create a key. Read-only/export
access is enough; it doesn't need to modify anything.

**2. Sign up for Resend**
[resend.com](https://resend.com) — free tier, no credit card. **Sign up
using jim.lee.nj@gmail.com** — Resend's shared `onboarding@resend.dev`
sender works without verifying your own domain, but only when sending to
the address you signed up with. Since this only ever emails you, that's
exactly what we need — no domain verification required.

Then: Dashboard → **API Keys** → create one (default "Sending access" is
fine).

**3. Set both as Worker secrets**
From this `worker-weekly-report/` directory:
```bash
npx wrangler secret put GOATCOUNTER_API_KEY
npx wrangler secret put RESEND_API_KEY
```
Paste each key when prompted — straight to Cloudflare, never into a file
in this repo or into any chat.

**4. Deploy**
```bash
npx wrangler deploy
```

**5. Test it now** rather than waiting for Monday — in the Cloudflare
dashboard: Workers & Pages → `jim-portfolio-weekly-report` → **Triggers**
tab → **Cron Triggers** → **Trigger event** (or ask me and I can trigger
it via the same path we used for the chat worker's `wrangler deploy`,
whichever's easier).

## Local testing before deploying

```bash
npx wrangler dev --test-scheduled
```
Then in another terminal:
```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```
This fires the `scheduled` handler locally (still calls the real
GoatCounter and Resend APIs, so it'll send you a real email).

## If Resend sending ever fails

That almost always means the "send to yourself only" sandbox rule above —
double check the Resend account was created with jim.lee.nj@gmail.com. If
you later want to send from a nicer address (e.g.
reports@yourdomain.com), verify a domain you own in Resend and update
`FROM_EMAIL` in `src/index.js`.
