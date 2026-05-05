// Supabase Edge Function: submit-survey
// Validates membership, inserts survey response, emails admin.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const RESEND_FROM = 'Guy Aga <guy@bestguy.ai>';
const ADMIN_EMAIL = 'guy@aga.digital';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TIME_BUCKETS = new Set(['lt1', '1to3', '3to10', '10plus']);
const TIME_LABEL: Record<string, string> = {
  lt1: '< 1 hour',
  '1to3': '1–3 hours',
  '3to10': '3–10 hours',
  '10plus': '10+ hours',
};

function escape(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

interface Payload {
  email?: string;
  name?: string;
  nps?: number;
  overall_rating?: number;
  top_useful_days?: number[];
  needs_depth_day?: number;
  what_built?: string;
  weekly_time_saved?: string;
  next_topic?: string;
  additional_comments?: string;
  lang?: 'he' | 'en';
}

function adminEmailHtml(r: any): string {
  const ts = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const stars = r.overall_rating ? '★'.repeat(r.overall_rating) + '☆'.repeat(5 - r.overall_rating) : '—';
  const npsColor = r.nps == null ? '#6B7280' : r.nps >= 9 ? '#10B981' : r.nps >= 7 ? '#F59E0B' : '#EF4444';
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>New survey from ${escape(r.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Hebrew:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F5F3EE;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;direction:rtl;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3EE;padding:40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(17,17,17,0.06);">
      <tr><td style="height:4px;background:#E63B2E;line-height:4px;font-size:0;">&nbsp;</td></tr>
      <tr><td style="padding:32px 40px 0 40px;">
        <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;">NEW_SURVEY // ${escape(r.lang.toUpperCase())}</div>
      </td></tr>
      <tr><td style="padding:14px 40px 0 40px;">
        <h1 style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:30px;line-height:1.15;font-weight:800;color:#111111;letter-spacing:-0.02em;">
          ${escape(r.name)} שלח/ה<br><span style="color:#E63B2E;font-style:italic;font-weight:700;">משוב מפורט.</span>
        </h1>
      </td></tr>
      <tr><td style="padding:32px 40px 0 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);" width="40%">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">NPS</div>
            </td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:20px;color:${npsColor};font-weight:800;">${r.nps == null ? '—' : r.nps + ' / 10'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Overall</div></td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:18px;color:#E63B2E;font-weight:600;">${stars}</div></td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Most useful</div></td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;color:#111111;font-weight:600;">Days ${(r.top_useful_days || []).join(', ') || '—'}</div></td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Needs depth</div></td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;color:#111111;font-weight:600;">Day ${r.needs_depth_day ?? '—'}</div></td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Time saved/wk</div></td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:14px;color:#111111;font-weight:600;">${escape(TIME_LABEL[r.weekly_time_saved] ?? '—')}</div></td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Email</div></td>
            <td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;direction:ltr;"><a href="mailto:${escape(r.email)}" style="font-family:'Open Sans',Arial,sans-serif;font-size:14px;color:#E63B2E;font-weight:600;text-decoration:none;">${escape(r.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:14px 0;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Time</div></td>
            <td style="padding:14px 0;text-align:left;direction:ltr;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:13px;color:rgba(17,17,17,0.65);">${escape(ts)}</div></td>
          </tr>
        </table>
      </td></tr>
      ${r.what_built ? `<tr><td style="padding:24px 40px 0 40px;"><div style="background:#E8E4DD;border-radius:14px;padding:20px 24px;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;margin-bottom:8px;">What they built</div><p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;color:#111111;line-height:1.6;direction:${r.lang === 'he' ? 'rtl' : 'ltr'};white-space:pre-wrap;">${escape(r.what_built)}</p></div></td></tr>` : ''}
      ${r.next_topic ? `<tr><td style="padding:14px 40px 0 40px;"><div style="background:#E8E4DD;border-radius:14px;padding:20px 24px;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;margin-bottom:8px;">Next topic wanted</div><p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;color:#111111;line-height:1.6;direction:${r.lang === 'he' ? 'rtl' : 'ltr'};white-space:pre-wrap;">${escape(r.next_topic)}</p></div></td></tr>` : ''}
      ${r.additional_comments ? `<tr><td style="padding:14px 40px 0 40px;"><div style="background:#E8E4DD;border-radius:14px;padding:20px 24px;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;margin-bottom:8px;">Additional comments</div><p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;color:#111111;line-height:1.6;direction:${r.lang === 'he' ? 'rtl' : 'ltr'};white-space:pre-wrap;">${escape(r.additional_comments)}</p></div></td></tr>` : ''}
      <tr><td style="padding:36px 40px 32px 40px;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.4);font-weight:600;">BESTGUY.AI &nbsp;·&nbsp; SURVEY NOTIFICATION &nbsp;·&nbsp; 10 DAYS 10 SKILLS</div></td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

async function sendNotification(r: any): Promise<void> {
  if (!RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: ADMIN_EMAIL,
      subject: `סקר חדש — ${r.name}`,
      html: adminEmailHtml(r),
      reply_to: r.email,
    }),
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'server not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: Payload;
  try { payload = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  const name = (payload.name ?? '').trim();
  if (!email || !name) {
    return new Response(JSON.stringify({ error: 'name and email required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: member, error: memberErr } = await supabase
    .from('course_members')
    .select('id, name, email')
    .eq('email', email)
    .maybeSingle();

  if (memberErr) {
    return new Response(JSON.stringify({ error: 'lookup failed: ' + memberErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!member) {
    return new Response(JSON.stringify({ error: 'not a course member' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Sanitize numeric fields
  const nps = typeof payload.nps === 'number' && payload.nps >= 0 && payload.nps <= 10
    ? Math.floor(payload.nps) : null;
  const overall_rating = typeof payload.overall_rating === 'number' && payload.overall_rating >= 1 && payload.overall_rating <= 5
    ? Math.floor(payload.overall_rating) : null;
  const needs_depth_day = typeof payload.needs_depth_day === 'number' && payload.needs_depth_day >= 1 && payload.needs_depth_day <= 10
    ? Math.floor(payload.needs_depth_day) : null;
  const top_useful_days = Array.isArray(payload.top_useful_days)
    ? payload.top_useful_days.filter((n) => typeof n === 'number' && n >= 1 && n <= 10).slice(0, 3).map((n) => Math.floor(n))
    : [];
  const weekly_time_saved = typeof payload.weekly_time_saved === 'string' && TIME_BUCKETS.has(payload.weekly_time_saved)
    ? payload.weekly_time_saved : null;
  const what_built = (payload.what_built ?? '').trim() || null;
  const next_topic = (payload.next_topic ?? '').trim() || null;
  const additional_comments = (payload.additional_comments ?? '').trim() || null;
  const lang = payload.lang === 'en' ? 'en' : 'he';

  const row = {
    member_id: member.id,
    name, email,
    nps, overall_rating,
    top_useful_days, needs_depth_day,
    what_built, weekly_time_saved,
    next_topic, additional_comments,
    lang, source: 'admin-link',
  };

  const { data: inserted, error: insErr } = await supabase
    .from('course_survey_responses')
    .insert(row)
    .select()
    .single();

  if (insErr) {
    return new Response(JSON.stringify({ error: 'insert failed: ' + insErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  sendNotification(row).catch(() => {});

  return new Response(
    JSON.stringify({ ok: true, id: inserted.id }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
