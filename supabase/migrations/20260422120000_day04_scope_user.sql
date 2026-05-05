-- Update Day 4 (AI Video Generation) install instructions to use --scope user
-- for global MCP installation. Without this flag, the fal MCP installs only for
-- the current project folder, which confuses students when they open a different project.

UPDATE course_sessions
SET
  install_prompt = replace(
    install_prompt,
    'claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer YOUR_FAL_KEY"',
    'claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer YOUR_FAL_KEY" --scope user'
  ),
  install_steps = jsonb_set(
    jsonb_set(
      jsonb_set(
        install_steps::jsonb,
        '{1,copy_text}',
        '"claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header \"Authorization: Bearer YOUR_FAL_KEY\" --scope user"'::jsonb
      ),
      '{2,desc_en}',
      '"Close the window from Step 2. Open a NEW Claude Code or Antigravity conversation. In Antigravity — type / and pick mcp servers from the list. In the terminal — type /mcp directly. Either way, fal-ai should show with a ✓ Connected status. Gold-standard check: open a completely different project folder and repeat — if fal-ai is still there, your global install worked. If it is gone, you forgot --scope user and need to re-run Step 2."'::jsonb
    ),
    '{2,desc_he}',
    '"סגרו את החלון משלב 2. פתחו שיחה חדשה ב-Claude Code או Antigravity. ב-Antigravity — הקלידו / ובחרו mcp servers מהרשימה. בטרמינל — הקלידו /mcp ישירות. בשני המקרים, fal-ai אמור להופיע עם סימן ירוק ✓ Connected. בדיקת זהב: פתחו תיקייה אחרת לגמרי וחזרו על הבדיקה — אם fal-ai עדיין שם, ההתקנה הגלובלית עבדה. אם הוא נעלם, פספסתם את --scope user וצריך להריץ שוב את שלב 2."'::jsonb
  )
WHERE day = 4;
