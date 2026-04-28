// Supabase Edge Function: send-bigbomb-email
// Sends user "thanks for signing up" + admin "new claim" emails via Resend
// Triggered by /thebigbomb form submission

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
// Hardcoded — do not pull from env so the addresses can't drift
const RESEND_FROM = 'Guy Aga <guy@bestguy.ai>';
const ADMIN_EMAIL = 'guy@aga.digital';

const COURSE_URL = 'https://my.schooler.biz/s/113939/1691505442920-6';
const SITE_URL = 'https://bestguy.ai';
const NEXT_LEVEL_URL = 'https://bestguy.ai/course/preview';
const LINKEDIN_URL = 'https://www.linkedin.com/in/guyaga/';
const YOUTUBE_URL = 'https://www.youtube.com/channel/UCc0ZbMyx7brZhdHf1G6ud2A';
const ACADEMY_URL = 'https://ai-academy.co.il';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Payload {
  name: string;
  email: string;
  phone?: string | null;
  role?: string | null;
}

function escape(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

function userEmailHtml(name: string): string {
  const safeName = escape(name);
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>תודה שנרשמת לקורס</title>
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
                ACCESS_GRANTED
              </div>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td align="center" style="padding:16px 40px 0 40px;text-align:center;">
              <h1 style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:42px;line-height:1.1;font-weight:800;color:#111111;letter-spacing:-0.02em;text-align:center;">
                תודה שנרשמת,<br>
                <span style="color:#E63B2E;font-style:italic;font-weight:700;">${safeName}.</span>
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" style="padding:24px 40px 0 40px;text-align:center;">
              <p style="margin:0 auto;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:17px;line-height:1.7;color:rgba(17,17,17,0.7);font-weight:400;max-width:440px;text-align:center;">
                הקורס שלך מחכה. שמור את הקישור הזה — אפשר לחזור אליו בכל עת.
              </p>
            </td>
          </tr>

          <!-- CTA card -->
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E8E4DD;border-radius:16px;">
                <tr>
                  <td align="center" style="padding:28px 28px 28px 28px;text-align:center;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.5);font-weight:600;margin-bottom:12px;text-align:center;">
                      הקישור לקורס
                    </div>
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:14px;color:#111111;direction:ltr;text-align:center;word-break:break-all;margin-bottom:20px;font-weight:400;">
                      ${COURSE_URL}
                    </div>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                      <tr>
                        <td style="background:#E63B2E;border-radius:999px;">
                          <a href="${COURSE_URL}" style="display:inline-block;padding:14px 28px;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:-0.01em;">
                            פתחו את הקורס &nbsp;←
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:40px 40px 0 40px;">
              <div style="height:1px;background:rgba(17,17,17,0.1);line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- 10 Days 10 Skills Section -->
          <tr>
            <td align="center" style="padding:32px 40px 0 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;margin-bottom:14px;text-align:center;">
                השלב הבא
              </div>
              <h2 style="margin:0 0 14px 0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:30px;line-height:1.1;font-weight:800;color:#111111;letter-spacing:-0.02em;text-align:center;">
                10 ימים. <span style="color:#E63B2E;font-style:italic;font-weight:700;">10 סקילים.</span>
              </h2>
              <p style="margin:0 auto 20px auto;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:15px;line-height:1.65;color:rgba(17,17,17,0.65);font-weight:400;max-width:440px;text-align:center;">
                קורס Claude Code פרימיום — סקיל ביום, 20 דקות בשיעור. בונים דברים אמיתיים, לא טוטוריאלים.
                אם המתנה הזו פתחה לכם את התיאבון, זה הצעד הבא.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="border:1px solid #111111;border-radius:999px;">
                    <a href="${NEXT_LEVEL_URL}" style="display:inline-block;padding:12px 24px;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:13px;font-weight:700;color:#111111;text-decoration:none;letter-spacing:-0.01em;">
                      לפרטי הקורס &nbsp;←
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:40px 40px 0 40px;">
              <div style="height:1px;background:rgba(17,17,17,0.1);line-height:1px;font-size:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Social links -->
          <tr>
            <td align="center" style="padding:28px 40px 8px 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.5);font-weight:600;margin-bottom:18px;text-align:center;">
                להישאר בקשר
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 5px;">
                    <a href="${LINKEDIN_URL}" style="display:inline-block;padding:10px 18px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;text-decoration:none;">LinkedIn</a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="${YOUTUBE_URL}" style="display:inline-block;padding:10px 18px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;text-decoration:none;">YouTube</a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="${SITE_URL}" style="display:inline-block;padding:10px 18px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;text-decoration:none;">BestGuy.AI</a>
                  </td>
                  <td style="padding:0 5px;">
                    <a href="${ACADEMY_URL}" style="display:inline-block;padding:10px 18px;border:1px solid rgba(17,17,17,0.15);border-radius:999px;font-family:'Open Sans',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#111111;text-decoration:none;">AI&nbsp;Academy</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:36px 40px 32px 40px;text-align:center;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.4);font-weight:600;text-align:center;">
                BESTGUY.AI &nbsp;·&nbsp; גיא אגא &nbsp;·&nbsp; 2026
              </div>
            </td>
          </tr>
        </table>

        <!-- Outside footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
          <tr>
            <td style="padding:0 12px;text-align:center;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:11px;color:rgba(17,17,17,0.4);line-height:1.6;">
              קיבלתם את האימייל הזה כי נרשמתם לקורס Gen-AI בכתובת bestguy.ai/thebigbomb
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminEmailHtml(name: string, email: string, phone: string | null, role: string | null): string {
  const safeName = escape(name);
  const safeEmail = escape(email);
  const safePhone = phone ? escape(phone) : '—';
  const safeRole = role ? escape(role) : '—';
  const ts = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>נרשם חדש לקורס המתנה</title>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans+Hebrew:wght@300;400;600;700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F5F3EE;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;direction:rtl;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3EE;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(17,17,17,0.06);">
          <tr><td style="height:4px;background:#E63B2E;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:36px 40px 0 40px;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#E63B2E;font-weight:600;">
                NEW_SIGNUP &nbsp;·&nbsp; THEBIGBOMB
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px 0 40px;">
              <h1 style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:34px;line-height:1.15;font-weight:800;color:#111111;letter-spacing:-0.02em;">
                משתמש חדש החליט<br>
                <span style="color:#E63B2E;font-style:italic;font-weight:700;">לקבל את המתנה.</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 0 40px;">
              <p style="margin:0;font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:16px;line-height:1.65;color:rgba(17,17,17,0.65);font-weight:400;">
                ${safeName} נרשם/ה לקורס Gen-AI החינמי. הפרטים למטה.
              </p>
            </td>
          </tr>

          <!-- Details table -->
          <tr>
            <td style="padding:32px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(17,17,17,0.1);">
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);" width="35%">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">שם</div>
                  </td>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;">
                    <div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:18px;color:#111111;font-weight:700;">${safeName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">אימייל</div>
                  </td>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;">
                    <a href="mailto:${safeEmail}" style="font-family:'Open Sans',Arial,sans-serif;font-size:16px;color:#E63B2E;font-weight:600;text-decoration:none;direction:ltr;display:inline-block;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">טלפון</div>
                  </td>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:16px;color:${phone ? '#111111' : 'rgba(17,17,17,0.35)'};font-weight:600;direction:ltr;display:inline-block;">${safePhone}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">תפקיד</div>
                  </td>
                  <td style="padding:18px 0;border-bottom:1px solid rgba(17,17,17,0.08);text-align:left;">
                    <div style="font-family:'Open Sans Hebrew','Open Sans',Arial,sans-serif;font-size:16px;color:${role ? '#111111' : 'rgba(17,17,17,0.35)'};font-weight:600;">${safeRole}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 0;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.45);font-weight:600;">זמן</div>
                  </td>
                  <td style="padding:18px 0;text-align:left;">
                    <div style="font-family:'Open Sans',Arial,sans-serif;font-size:14px;color:rgba(17,17,17,0.7);font-weight:400;direction:ltr;display:inline-block;">${escape(ts)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:48px 40px 32px 40px;">
              <div style="font-family:'Open Sans',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.4);font-weight:600;">
                BESTGUY.AI &nbsp;·&nbsp; ADMIN NOTIFICATION &nbsp;·&nbsp; THEBIGBOMB
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

async function sendEmail(to: string, subject: string, html: string, replyTo?: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `${res.status} ${body}` };
  }
  return { ok: true };
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

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone = null, role = null } = payload;
  if (!name || !email) {
    return new Response(JSON.stringify({ error: 'name and email required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Send both emails in parallel
  const [userResult, adminResult] = await Promise.all([
    sendEmail(email, 'תודה שנרשמת — הקורס שלך מוכן', userEmailHtml(name)),
    sendEmail(
      ADMIN_EMAIL,
      `נרשם חדש לקורס המתנה — ${name}`,
      adminEmailHtml(name, email, phone, role),
      email,
    ),
  ]);

  return new Response(
    JSON.stringify({
      user: userResult,
      admin: adminResult,
      ok: userResult.ok && adminResult.ok,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
});
