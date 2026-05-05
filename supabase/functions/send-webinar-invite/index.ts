// Supabase Edge Function: send-webinar-invite
// Sends the Lesson 10 webinar invite to course_members via Resend.
// Modes: dry (count only), test (Guy only), full (all members).
//
// Invoke:
//   supabase functions invoke send-webinar-invite --body '{"mode":"test"}'

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { POSTER_B64 } from './poster.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const RESEND_FROM = 'Guy Aga <guy@bestguy.ai>';
const TEST_RECIPIENT = 'guy@aga.digital';

// Webinar specifics — locked
const WEBINAR_TITLE_HE = 'ערב השקה - שיעור 10 - Vibe Coding · Supabase · Edge Functions';
const WEBINAR_DESC_HE =
  'השיעור האחרון של 10 ימים 10 סקילים. נבנה אפליקציה אמיתית בלייב — Netlify · Supabase · Edge Functions. הצטרפות בזום: https://onoac-il.zoom.us/j/87023475980';
const ZOOM_URL = 'https://onoac-il.zoom.us/j/87023475980';
const GCAL_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent(WEBINAR_TITLE_HE) +
  '&dates=20260507T193000/20260507T210000' +
  '&ctz=Asia/Jerusalem' +
  '&location=' + encodeURIComponent(ZOOM_URL) +
  '&details=' + encodeURIComponent(WEBINAR_DESC_HE);

const SUBJECT = 'ערב השקה. בלייב. חמישי 19:30 🎤';

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

function firstName(full: string): string {
  return String(full ?? '').trim().split(/\s+/)[0] || '';
}

function emailHtml(name: string, posterUrl: string): string {
  const safeName = escape(firstName(name));
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(SUBJECT)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Hebrew:wght@300;400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F5F3EE;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;direction:rtl;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(17,17,17,0.06);">

          <!-- Top red tape -->
          <tr><td style="height:4px;background:#E63B2E;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <!-- Eyebrow -->
          <tr>
            <td align="center" style="padding:36px 40px 0 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;">
                LESSON 10 // ערב השקה
              </div>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td align="center" style="padding:16px 40px 0 40px;text-align:center;">
              <h1 style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:42px;line-height:1.1;font-weight:800;color:#111111;letter-spacing:-0.02em;text-align:center;">
                ${safeName}, השיעור<br>
                <span style="color:#E63B2E;font-style:italic;font-weight:700;">האחרון.</span>
              </h1>
            </td>
          </tr>

          <!-- Subhead -->
          <tr>
            <td align="center" style="padding:18px 40px 0 40px;text-align:center;">
              <p style="margin:0 auto;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:17px;line-height:1.7;color:rgba(17,17,17,0.7);font-weight:400;max-width:460px;text-align:center;">
                בלייב. ביחד. בונים אמיתי.
              </p>
            </td>
          </tr>

          <!-- POSTER IMAGE -->
          <tr>
            <td align="center" style="padding:32px 24px 0 24px;">
              <img src="${posterUrl}" alt="ערב השקה - שיעור 10" width="552" style="display:block;width:100%;max-width:552px;height:auto;border-radius:14px;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding:32px 40px 0 40px;text-align:center;">
              <p style="margin:0 auto;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:16px;line-height:1.7;color:rgba(17,17,17,0.75);font-weight:400;max-width:480px;text-align:center;">
                10 שיעורים. 10 סקילים. עכשיו הזמן להפעיל הכל ביחד.<br>
                ביום חמישי, 7.5, ב-19:30 — נבנה אפליקציה אמיתית מאפס:
              </p>
            </td>
          </tr>

          <!-- Stack pills -->
          <tr>
            <td align="center" style="padding:20px 40px 0 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 4px;">
                    <span style="display:inline-block;padding:8px 14px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;">NETLIFY</span>
                  </td>
                  <td style="padding:0 4px;">
                    <span style="display:inline-block;padding:8px 14px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;">SUPABASE</span>
                  </td>
                  <td style="padding:0 4px;">
                    <span style="display:inline-block;padding:8px 14px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;">EDGE&nbsp;FUNCTIONS</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA buttons -->
          <tr>
            <td align="center" style="padding:36px 40px 0 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 6px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#E63B2E;border-radius:999px;">
                          <a href="${ZOOM_URL}" style="display:inline-block;padding:14px 26px;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:-0.01em;">
                            🎥&nbsp;&nbsp;הצטרפות&nbsp;לזום&nbsp;&nbsp;←
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding:0 6px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border:1.5px solid #111111;border-radius:999px;">
                          <a href="${GCAL_URL}" style="display:inline-block;padding:12.5px 24px;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:14px;font-weight:700;color:#111111;text-decoration:none;letter-spacing:-0.01em;">
                            📅&nbsp;&nbsp;הוספה&nbsp;ליומן
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Date row -->
          <tr>
            <td align="center" style="padding:28px 40px 0 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:13px;color:rgba(17,17,17,0.55);font-weight:600;letter-spacing:0.06em;">
                חמישי · 07.05.26 · 19:30 (Asia/Jerusalem)
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:36px 40px 0 40px;">
              <div style="height:1px;background:rgba(17,17,17,0.08);line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td align="center" style="padding:28px 40px 0 40px;text-align:center;">
              <p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:16px;line-height:1.65;color:#111111;font-weight:600;text-align:center;">
                נתראה,<br>
                <span style="font-style:italic;font-weight:700;color:#E63B2E;">Guy</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:36px 40px 32px 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.4);font-weight:600;text-align:center;">
                BESTGUY.AI &nbsp;·&nbsp; גיא אגא &nbsp;·&nbsp; LESSON 10
              </div>
            </td>
          </tr>
        </table>

        <!-- Outside footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
          <tr>
            <td style="padding:0 12px;text-align:center;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:11px;color:rgba(17,17,17,0.4);line-height:1.6;">
              קיבלתם את האימייל הזה כי אתם חברים בקורס 10 ימים 10 סקילים.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

const POSTER_BUCKET = 'email-assets';
const POSTER_FILE = 'webinar-2026-05-07-poster-loadout.jpg';

async function ensurePosterUrl(supabase: ReturnType<typeof createClient>): Promise<string> {
  // Idempotent bucket creation; ignore "already exists"
  try {
    await supabase.storage.createBucket(POSTER_BUCKET, { public: true });
  } catch (_) {
    // ignore
  }
  // Upsert the poster
  const bytes = base64ToBytes(POSTER_B64);
  const { error: upErr } = await supabase.storage
    .from(POSTER_BUCKET)
    .upload(POSTER_FILE, bytes, { contentType: 'image/jpeg', upsert: true });
  if (upErr) throw new Error('upload failed: ' + upErr.message);
  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(POSTER_FILE);
  return data.publicUrl;
}

interface SendResult {
  email: string;
  ok: boolean;
  error?: string;
  id?: string;
}

async function sendOne(to: string, name: string, posterUrl: string): Promise<SendResult> {
  const html = emailHtml(name, posterUrl);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject: SUBJECT,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { email: to, ok: false, error: `${res.status} ${body}` };
  }
  const json = await res.json();
  return { email: to, ok: true, id: json?.id };
}

interface InvokePayload {
  mode?: 'dry' | 'test' | 'full';
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

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Supabase env vars not set' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: InvokePayload = {};
  try {
    payload = await req.json();
  } catch {
    // empty body is fine
  }
  const mode = (payload.mode ?? 'dry') as 'dry' | 'test' | 'full';

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: members, error } = await supabase
    .from('course_members')
    .select('id,name,email')
    .order('id');

  if (error) {
    return new Response(JSON.stringify({ error: 'db error: ' + error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const list = members ?? [];

  if (mode === 'dry') {
    return new Response(
      JSON.stringify({
        mode,
        recipients: list.length,
        first_three: list.slice(0, 3).map((m) => ({ name: m.name, email: m.email })),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  // For test mode, override recipients to just the test address
  let toSend: { name: string; email: string }[];
  if (mode === 'test') {
    const me = list.find((m) => (m.email ?? '').toLowerCase() === TEST_RECIPIENT);
    toSend = [{ name: me?.name ?? 'Guy', email: TEST_RECIPIENT }];
  } else {
    toSend = list.map((m) => ({ name: m.name, email: m.email })).filter((x) => x.email);
  }

  const posterUrl = await ensurePosterUrl(supabase);

  const results: SendResult[] = [];
  for (const r of toSend) {
    const res = await sendOne(r.email, r.name, posterUrl);
    results.push(res);
    // Respect rate limits — 100ms between sends ~ 10/sec
    await new Promise((resolve) => setTimeout(resolve, 110));
  }

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;

  return new Response(
    JSON.stringify({
      mode,
      sent: okCount,
      failed: failCount,
      total: results.length,
      results,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
