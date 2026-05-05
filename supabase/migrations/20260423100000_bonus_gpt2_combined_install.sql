-- Collapse the 4-step install flow for the GPT Image 2 bonus into 3 steps.
-- Steps 3 (set env var manually) and 4 (install skill) merge into one "one-prompt"
-- Claude Code install: clone skill + set global env var + npm install + test image.
-- Reason: non-coders struggle with manual env var setup; Claude can do it all
-- in a single prompt if the student pastes their key into the prompt.

UPDATE course_sessions
SET install_steps = '[
  {
    "n": 1,
    "link": "https://platform.openai.com/api-keys",
    "desc_en": "Sign in to OpenAI, click Create new secret key, copy the key (starts with sk-) and save it somewhere safe. You will paste it into Claude Code in Step 3.",
    "desc_he": "היכנסו ל-OpenAI, לחצו Create new secret key, העתיקו את המפתח (מתחיל ב-sk-) ושמרו במקום בטוח. תדביקו אותו ל-Claude Code בשלב 3.",
    "title_en": "Get an OpenAI API key",
    "title_he": "קבלו מפתח API מ-OpenAI",
    "link_label_en": "Open OpenAI API keys",
    "link_label_he": "פתחו את דף המפתחות של OpenAI"
  },
  {
    "n": 2,
    "link": "https://platform.openai.com/settings/organization/general",
    "desc_en": "gpt-image-2 is verified-only. Click Verify Organization, complete identity check, then wait up to 15 minutes for the verification to activate. Without this step every image request will fail.",
    "desc_he": "gpt-image-2 דורש אימות ארגון. לחצו Verify Organization, השלימו אימות זהות, וחכו עד 15 דקות להפעלה. בלי השלב הזה כל בקשה ליצירת תמונה תיכשל.",
    "title_en": "Complete Organization Verification (REQUIRED)",
    "title_he": "השלימו Organization Verification (חובה)",
    "link_label_en": "Open OpenAI Verification",
    "link_label_he": "פתחו את דף האימות של OpenAI"
  },
  {
    "n": 3,
    "desc_en": "Paste this into Claude Code and replace YOUR_KEY_HERE with your actual key from Step 1. Claude will: install the skill, save your API key as a permanent environment variable (works in every project forever), install the SDK, and generate a test image to confirm everything works. One-time setup.",
    "desc_he": "הדביקו את הפרומפט הבא ל-Claude Code והחליפו את YOUR_KEY_HERE במפתח שלכם משלב 1. Claude יתקין את הסקיל, ישמור את המפתח שלכם כמשתנה סביבה קבוע (עובד בכל פרויקט לתמיד), יתקין את ה-SDK, וייצור תמונת בדיקה לוודא שהכל עובד. הגדרה חד-פעמית.",
    "title_en": "Install everything (one prompt)",
    "title_he": "התקנה מלאה (פרומפט אחד)",
    "copy_text": "Install the gpt2-image skill from https://github.com/guyaga/10d10s-bonus-gpt2-image. My OpenAI API key is: YOUR_KEY_HERE. Please save this key as a permanent environment variable on my system (OPENAI_API_KEY) so it persists across all terminals and projects. Then run `npm install openai --prefix ~/.claude/skills/gpt2-image` to install the SDK. Finally, verify it works by generating a test image: a photorealistic beige coffee mug on a wooden table, save to test-mug.png.",
    "copy_label_en": "Paste into Claude Code (replace YOUR_KEY_HERE first)",
    "copy_label_he": "הדביקו ב-Claude Code (החליפו YOUR_KEY_HERE קודם)"
  }
]'::jsonb
WHERE category = 'bonus' AND name_en = 'GPT Image 2';
