-- Add two new bonuses to the course hub:
--   • brand-kit       — capture and serve brand profiles to other Claude Code skills
--   • social-carousel — generate branded multi-slide social carousels (consumes brand-kit)
-- Both ship as standalone GitHub repos under github.com/guyaga.

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
) VALUES
(
  'bonus',
  NULL,
  'Brand Kit',
  'ברנד קיט',
  'Capture your brand once — colors, fonts, voice, logo, even your photo — and serve it to every Claude Code skill that needs it. Stop hardcoding brand info in every skill. Pairs with Social Carousel and any future branded skill.

The skill stores your brand profile at ~/.claude/brand-kits/ (outside any skill folder, so it survives skill upgrades). You can manage multiple brand profiles and switch the active one with one command — useful if you work with multiple clients.',
  'לכדו את המותג שלכם פעם אחת — צבעים, פונטים, טון, לוגו, ואפילו תמונה שלכם — והגישו אותו לכל סקיל של Claude Code שצריך אותו. הפסיקו לקודד את פרטי המותג בכל סקיל מחדש. עובד מצוין עם Social Carousel וכל סקיל מותגי עתידי.

הסקיל שומר את פרופיל המותג ב-~/.claude/brand-kits/ (מחוץ לתיקיית הסקיל, כך שהוא שורד שדרוגי סקיל). אפשר לנהל מספר פרופילי מותג ולעבור בין פעיל אחד לפקודה — שימושי אם עובדים עם כמה לקוחות.',
  'Claude Code Skill',
  'Image',
  'https://github.com/guyaga/brand-kit',
  'https://github.com/guyaga/brand-kit#readme',
  true,
  'Install the brand-kit skill from https://github.com/guyaga/brand-kit by cloning it to ~/.claude/skills/brand-kit, running npm install in that folder, then walking me through creating my first brand profile interactively (the cli.mjs init command).',
  NULL,
  '[]'::jsonb
),
(
  'bonus',
  NULL,
  'Social Carousel',
  'סושיאל קרוסלה',
  'Generate branded multi-slide social media carousels (Instagram, LinkedIn, X, Facebook) with one command. Pick your image model — nano-banano-pro (Gemini 3 Pro), gpt-image-2 (OpenAI), or both for comparison. Pulls colors, fonts, logo, and even your person photo from your active brand-kit profile (or asks once and caches if brand-kit is not installed).

Coherence is locked across slides: same palette, typography, logo placement, and visual style. Output goes to a numbered folder with a manifest so you can re-run with adjustments.',
  'צרו קרוסלות מותגיות מרובות שקופיות לרשתות החברתיות (אינסטגרם, לינקדאין, X, פייסבוק) בפקודה אחת. בחרו מודל תמונות — nano-banano-pro (Gemini 3 Pro), gpt-image-2 (OpenAI), או שניהם להשוואה. מושך צבעים, פונטים, לוגו, ואפילו תמונה אישית מפרופיל ה-brand-kit הפעיל שלכם (או שואל פעם אחת ושומר במטמון אם brand-kit לא מותקן).

עקביות נעולה בין השקופיות: אותה פלטה, טיפוגרפיה, מיקום לוגו, וסגנון ויזואלי. הפלט הולך לתיקייה ממוספרת עם מניפסט כדי שתוכלו להריץ שוב עם התאמות.',
  'Claude Code Skill',
  'Image',
  'https://github.com/guyaga/social-carousel',
  'https://github.com/guyaga/social-carousel#readme',
  true,
  'Install the social-carousel skill from https://github.com/guyaga/social-carousel by cloning it to ~/.claude/skills/social-carousel, running npm install in that folder, and helping me generate my first branded carousel interactively (the cli.mjs command). If brand-kit is not yet installed, suggest installing it first from https://github.com/guyaga/brand-kit so the carousel can auto-pull my brand colors, logo, and photo.',
  NULL,
  '[]'::jsonb
);
