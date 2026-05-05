-- Third bonus: Chrome DevTools MCP (browser debugging).
-- Deliberately positioned as a developer tool complementary to Playwright.
-- Description triages upfront so non-coders don't get confused by two browser MCPs.

INSERT INTO course_sessions (
  category,
  day,
  name_en,
  name_he,
  desc_en,
  desc_he,
  service,
  icon,
  github_url,
  pdf_url,
  is_unlocked,
  install_prompt,
  install_steps,
  examples
) VALUES (
  'bonus',
  NULL,
  'Chrome DevTools MCP',
  'Chrome DevTools MCP',
  'For developers debugging websites. Give Claude full Chrome DevTools access — performance tracing, network inspection, console logs with source-mapped stack traces, and deep browser diagnostics.

If you just want Claude to click, screenshot, or automate a browser, use Playwright MCP above — it''s simpler and works across all browsers. Use Chrome DevTools when you need to debug WHY a site is slow or broken, not just interact with it.',
  'למפתחים שמפתחים או מתקנים אתרים. תנו ל-Claude גישה מלאה ל-Chrome DevTools — ניתוח ביצועים, בדיקת בקשות רשת, לוגים של הקונסולה עם stack traces מדויקים, ואבחון מעמיק של הדפדפן.

אם אתם רק רוצים ש-Claude ילחץ, יצלם מסך, או יאוטמט דפדפן — תשתמשו ב-Playwright MCP למעלה. זה פשוט יותר ועובד בכל הדפדפנים. Chrome DevTools הוא לכשצריכים להבין *למה* אתר איטי או שבור, לא רק לפעול עליו.',
  'Browser Debugging · Chrome DevTools',
  'Bug',
  'https://github.com/ChromeDevTools/chrome-devtools-mcp',
  'https://github.com/ChromeDevTools/chrome-devtools-mcp#readme',
  true,
  'Install Chrome DevTools MCP globally by running in a terminal: claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest',
  '[
    {
      "n": 1,
      "desc_en": "Prerequisites: Node.js 20.19+ and Chrome installed. Run this command in a terminal. The --scope user flag makes it available in every project.",
      "desc_he": "דרישות מוקדמות: Node.js 20.19+ ו-Chrome מותקנים. הריצו בטרמינל. הדגל --scope user הופך את זה לזמין בכל פרויקט.",
      "title_en": "Install globally",
      "title_he": "התקנה גלובלית",
      "copy_text": "claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest",
      "copy_label_en": "Run in terminal",
      "copy_label_he": "הריצו בטרמינל"
    },
    {
      "n": 2,
      "desc_en": "Open a NEW conversation in Claude Code or Antigravity. Type / and pick mcp servers — you should see chrome-devtools with ✓ Connected. Chrome will launch when you first use a DevTools command.",
      "desc_he": "פתחו שיחה חדשה ב-Claude Code או Antigravity. הקלידו / ובחרו mcp servers — אמור להופיע chrome-devtools עם סימן ירוק. Chrome יעלה בפעם הראשונה שתשתמשו בפקודת DevTools.",
      "title_en": "Verify it''s connected",
      "title_he": "ודאו שהוא מחובר"
    }
  ]'::jsonb,
  '[
    {
      "prompt": "Open https://bestguy.ai in Chrome DevTools, run a performance trace, and tell me which 3 things are slowing the page down the most",
      "title_en": "Find performance bottlenecks",
      "title_he": "איתור צווארי בקבוק בביצועים",
      "result_image": ""
    },
    {
      "prompt": "Load my admin dashboard, watch the network tab, and list every API request that takes longer than 500ms with the endpoint and status code",
      "title_en": "Debug slow API calls",
      "title_he": "איתור קריאות API איטיות",
      "result_image": ""
    },
    {
      "prompt": "Open my site at localhost:5173, reproduce the bug where clicking the submit button does nothing, and read the browser console — find the JavaScript error and point me to the exact line",
      "title_en": "Track down a JS bug",
      "title_he": "איתור באג JavaScript",
      "result_image": ""
    }
  ]'::jsonb
);
