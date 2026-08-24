const GOATCOUNTER_BASE = 'https://jim-portfolio.goatcounter.com/api/v0';
const DASHBOARD_URL = 'https://jim-portfolio.goatcounter.com';
const TO_EMAIL = 'jim.lee.nj@gmail.com';
const FROM_EMAIL = 'Portfolio Analytics <onboarding@resend.dev>';

async function gcFetch(env, path) {
  const res = await fetch(`${GOATCOUNTER_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${env.GOATCOUNTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GoatCounter ${path} failed: ${res.status} ${text.slice(0, 200)}`);
  }
  return res.json();
}

function isoRoundedHour(date) {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}

function formatDateRange(start, end) {
  const opts = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

async function buildSummary(env) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const nowIso = isoRoundedHour(now);
  const weekAgoIso = isoRoundedHour(weekAgo);
  const twoWeeksAgoIso = isoRoundedHour(twoWeeksAgo);

  const [totalThis, totalPrior, hits, refs] = await Promise.all([
    gcFetch(env, `/stats/total?start=${encodeURIComponent(weekAgoIso)}&end=${encodeURIComponent(nowIso)}`),
    gcFetch(env, `/stats/total?start=${encodeURIComponent(twoWeeksAgoIso)}&end=${encodeURIComponent(weekAgoIso)}`),
    gcFetch(env, `/stats/hits?start=${encodeURIComponent(weekAgoIso)}&end=${encodeURIComponent(nowIso)}&limit=5`),
    gcFetch(env, `/stats/toprefs?start=${encodeURIComponent(weekAgoIso)}&end=${encodeURIComponent(nowIso)}&limit=5`),
  ]);

  const thisWeek = totalThis.total || 0;
  const priorWeek = totalPrior.total || 0;
  let trend = '';
  if (priorWeek > 0) {
    const pct = Math.round(((thisWeek - priorWeek) / priorWeek) * 100);
    trend =
      pct === 0
        ? '(flat vs. last week)'
        : pct > 0
        ? `(up ${pct}% vs. last week)`
        : `(down ${Math.abs(pct)}% vs. last week)`;
  }

  const topPages =
    (hits.hits || [])
      .slice(0, 5)
      .map((h) => `  ${h.path} — ${h.count} visit${h.count === 1 ? '' : 's'}`)
      .join('\n') || '  (no page data yet)';
  const topRefs =
    (refs.stats || [])
      .slice(0, 5)
      .map((r) => `  ${r.name || '(direct/unknown)'} — ${r.count} visit${r.count === 1 ? '' : 's'}`)
      .join('\n') || '  (no referrer data yet)';

  const dateRange = formatDateRange(weekAgo, now);

  const body = `Weekly traffic summary for your portfolio site (${dateRange}):

Total visits: ${thisWeek} ${trend}

Top pages:
${topPages}

Top referrers:
${topRefs}

Full dashboard: ${DASHBOARD_URL}`;

  return { subject: `Portfolio Site — Weekly Traffic Summary (${dateRange})`, body };
}

async function sendEmail(env, subject, text) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [TO_EMAIL], subject, text }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Resend send failed: ${res.status} ${t.slice(0, 300)}`);
  }
}

async function run(env) {
  try {
    const { subject, body } = await buildSummary(env);
    await sendEmail(env, subject, body);
  } catch (err) {
    // Best-effort: let Jim know it broke and why, rather than failing silently.
    try {
      await sendEmail(
        env,
        'Portfolio Site — Weekly Traffic Summary (failed)',
        `The weekly traffic summary couldn't be generated this week.\n\nError: ${err.message}\n\nCheck the dashboard directly: ${DASHBOARD_URL}`
      );
    } catch {
      // If even the fallback email fails, this surfaces in the Cloudflare
      // dashboard's cron/exception logs (or `wrangler tail`) instead.
    }
    throw err;
  }
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(run(env));
  },
};
