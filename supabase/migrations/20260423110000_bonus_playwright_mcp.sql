-- Second bonus: Playwright MCP (browser automation).
-- No API key, no paid service, no repo to maintain — official Microsoft MCP
-- installed via npx. Link-only bonus that points to Playwright's own docs.

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
  'Playwright MCP',
  'Playwright MCP',
  'Give Claude a real browser. Playwright MCP lets Claude navigate pages, click buttons, fill forms, take screenshots, extract content, and test websites — across Chrome, Firefox, Safari (WebKit), and Edge. No API key, no paid service. Just npm.',
  'תנו ל-Claude דפדפן אמיתי. Playwright MCP מאפשר ל-Claude לנווט באתרים, ללחוץ, למלא טפסים, לצלם מסך, לחלץ תוכן ולבדוק אתרים — ב-Chrome, Firefox, Safari, ו-Edge. בלי API key, בלי שירות בתשלום. רק npm.',
  'Browser Automation · Playwright MCP',
  'Globe',
  'https://github.com/microsoft/playwright-mcp',
  'https://playwright.dev/docs/getting-started-mcp',
  true,
  'Install the Playwright MCP globally by running this in a terminal: claude mcp add --scope user playwright npx @playwright/mcp@latest',
  '[
    {
      "n": 1,
      "desc_en": "Run this command in a terminal (PowerShell, Terminal, or bash). The --scope user flag makes it available in every project, forever. No API key needed.",
      "desc_he": "הריצו את הפקודה בטרמינל (PowerShell, Terminal, או bash). הדגל --scope user מתקין גלובלית — זמין בכל פרויקט, לתמיד. אין צורך במפתח API.",
      "title_en": "Install globally",
      "title_he": "התקנה גלובלית",
      "copy_text": "claude mcp add --scope user playwright npx @playwright/mcp@latest",
      "copy_label_en": "Run in terminal",
      "copy_label_he": "הריצו בטרמינל"
    },
    {
      "n": 2,
      "desc_en": "Open a NEW conversation in Claude Code or Antigravity. Type / and pick mcp servers from the menu — you should see playwright with ✓ Connected. First time you use a browser tool, Playwright downloads Chromium (~170MB, one-time).",
      "desc_he": "פתחו שיחה חדשה ב-Claude Code או Antigravity. הקלידו / ובחרו mcp servers מהרשימה — אמור להופיע playwright עם סימן ירוק. בפעם הראשונה שמשתמשים בכלי דפדפן, Playwright יוריד את Chromium (~170MB, פעם אחת).",
      "title_en": "Verify it''s connected",
      "title_he": "ודאו שהוא מחובר"
    }
  ]'::jsonb,
  '[
    {
      "prompt": "Use Playwright to take a screenshot of https://bestguy.ai hero section. Save to hero.png",
      "title_en": "Screenshot a live site",
      "title_he": "צילום מסך של אתר חי",
      "result_image": ""
    },
    {
      "prompt": "Navigate to a competitor''s pricing page (I will give you the URL), read the content, and summarize their plans in a table",
      "title_en": "Competitor research",
      "title_he": "מחקר מתחרים",
      "result_image": ""
    },
    {
      "prompt": "Log into my admin dashboard at /admin/course and verify the new feature I just built works end-to-end — click through the flow and report back",
      "title_en": "Automated UI testing",
      "title_he": "בדיקת UI אוטומטית",
      "result_image": ""
    }
  ]'::jsonb
);
