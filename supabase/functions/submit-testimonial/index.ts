// Supabase Edge Function: submit-testimonial
// Validates membership against course_members, inserts testimonial, sends admin notification via Resend.
//
// POST body:
// {
//   email: string (required, must exist in course_members),
//   name: string (required),
//   testimonial: string (required, min 10 chars),
//   role?: string,
//   company?: string,
//   rating?: 1-5,
//   linkedin_url?: string,
//   lang?: 'he' | 'en'
// }

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

function escape(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

interface Payload {
  email?: string;
  name?: string;
  testimonial?: string;
  improvement?: string;
  role?: string;
  company?: string;
  rating?: number;
  linkedin_url?: string;
  lang?: 'he' | 'en';
}

function adminNotificationHtml(t: {
  name: string;
  email: string;
  role: string | null;
  company: string | null;
  testimonial: string;
  improvement: string | null;
  rating: number | null;
  linkedin_url: string | null;
  lang: string;
}): string {
  const stars = t.rating ? '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) : '—';
  const ts = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>New testimonial from ${escape(t.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Hebrew:wght@400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F5F3EE;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;direction:rtl;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(17,17,17,0.06);">
          <tr><td style="height:4px;background:#E63B2E;line-height:4px;font-size:0;">&nbsp;</td></tr>
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;">
                NEW_TESTIMONIAL // ${escape(t.lang.toUpperCase())}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 40px 0 40px;">
              <h1 style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:30px;line-height:1.15;font-weight:800;color:#111111;letter-spacing:-0.02em;">
                ${escape(t.name)} השאיר/ה<br>
                <span style="color:#E63B2E;font-style:italic;font-weight:700;">המלצה.</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0 40px;">
              <p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;line-height:1.65;color:rgba(17,17,17,0.6);">
                סטטוס: <strong>pending</strong> — לאישור ב-/admin/testimonials
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8E4DD;border-radius:14px;">
                <tr>
                  <td style="padding:24px;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.5);font-weight:600;margin-bottom:12px;">
                      Testimonial &nbsp;${stars}
                    </div>
                    <p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:16px;line-height:1.65;color:#111111;direction:${t.lang === 'he' ? 'rtl' : 'ltr'};white-space:pre-wrap;">${escape(t.testimonial)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${t.improvement ? `<tr>
            <td style="padding:18px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF7E6;border:1px solid rgba(245,158,11,0.3);border-radius:14px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B45309;font-weight:600;margin-bottom:10px;">
                      Improvement Feedback (private)
                    </div>
                    <p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;line-height:1.6;color:#451A03;direction:${t.lang === 'he' ? 'rtl' : 'ltr'};white-space:pre-wrap;">${escape(t.improvement)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td width="35%" style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Email</div></td><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;direction:ltr;"><a href="mailto:${escape(t.email)}" style="font-family:'Open Sans',Arial,sans-serif;font-size:15px;color:#E63B2E;font-weight:600;text-decoration:none;">${escape(t.email)}</a></td></tr>
                <tr><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Role</div></td><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;color:${t.role ? '#111111' : 'rgba(17,17,17,0.35)'};font-weight:600;">${escape(t.role ?? '—')}</div></td></tr>
                <tr><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Company</div></td><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;"><div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;color:${t.company ? '#111111' : 'rgba(17,17,17,0.35)'};font-weight:600;">${escape(t.company ?? '—')}</div></td></tr>
                <tr><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">LinkedIn</div></td><td style="padding:14px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;direction:ltr;">${t.linkedin_url ? `<a href="${escape(t.linkedin_url)}" style="font-family:'Open Sans',Arial,sans-serif;font-size:14px;color:#E63B2E;font-weight:600;text-decoration:none;">${escape(t.linkedin_url)}</a>` : '<span style="font-family:\'Open Sans\',Arial,sans-serif;font-size:14px;color:rgba(17,17,17,0.35);font-weight:600;">—</span>'}</td></tr>
                <tr><td style="padding:14px 0;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">Time</div></td><td style="padding:14px 0;text-align:left;direction:ltr;"><div style="font-family:'Open Sans',Arial,sans-serif;font-size:13px;color:rgba(17,17,17,0.65);">${escape(ts)}</div></td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px 32px 40px;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.4);font-weight:600;">
                BESTGUY.AI &nbsp;·&nbsp; ADMIN NOTIFICATION &nbsp;·&nbsp; TESTIMONIALS
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendNotification(t: any): Promise<void> {
  if (!RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: ADMIN_EMAIL,
      subject: `המלצה חדשה — ${t.name}`,
      html: adminNotificationHtml(t),
      reply_to: t.email,
    }),
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'server not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  const name = (payload.name ?? '').trim();
  const testimonial = (payload.testimonial ?? '').trim();
  const lang = (payload.lang === 'en' ? 'en' : 'he');
  const role = (payload.role ?? '').trim() || null;
  const company = (payload.company ?? '').trim() || null;
  const linkedin_url = (payload.linkedin_url ?? '').trim() || null;
  const improvement = (payload.improvement ?? '').trim() || null;
  const rating = typeof payload.rating === 'number' && payload.rating >= 1 && payload.rating <= 5
    ? Math.floor(payload.rating)
    : null;

  if (!email || !name || !testimonial) {
    return new Response(JSON.stringify({ error: 'name, email, and testimonial are required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (testimonial.length < 10) {
    return new Response(JSON.stringify({ error: 'testimonial too short' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Validate membership
  const { data: member, error: memberErr } = await supabase
    .from('course_members')
    .select('id, name, email')
    .eq('email', email)
    .maybeSingle();

  if (memberErr) {
    return new Response(JSON.stringify({ error: 'lookup failed: ' + memberErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!member) {
    return new Response(JSON.stringify({ error: 'not a course member' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Insert
  const row = {
    member_id: member.id,
    name,
    email,
    role,
    company,
    testimonial,
    improvement,
    rating,
    linkedin_url,
    lang,
    status: 'pending',
    source: 'admin-link',
  };
  const { data: inserted, error: insErr } = await supabase
    .from('testimonials')
    .insert(row)
    .select()
    .single();

  if (insErr) {
    return new Response(JSON.stringify({ error: 'insert failed: ' + insErr.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Fire admin notification (don't block on it)
  sendNotification(row).catch(() => {/* swallow */});

  return new Response(
    JSON.stringify({ ok: true, id: inserted.id }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
