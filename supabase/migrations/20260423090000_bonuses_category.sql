-- Add a category column to course_sessions so we can distinguish
-- core lesson rows (days -1 through 10) from bonus content.
-- Existing rows become 'lesson' by default; bonuses get 'bonus'.

ALTER TABLE course_sessions
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'lesson';

CREATE INDEX IF NOT EXISTS idx_course_sessions_category
  ON course_sessions(category);

-- Allow day to be NULL so bonuses don't need a day number
ALTER TABLE course_sessions
  ALTER COLUMN day DROP NOT NULL;

-- Insert the first bonus: GPT Image 2
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
  'GPT Image 2',
  'GPT Image 2',
  'Generate and edit images with OpenAI''s gpt-image-2 — OpenAI''s latest image model. Supports reference images, masked editing, and up to 4K. A complement to Day 1 (Gemini 3 Pro) when you need OpenAI-style output or don''t have a Gemini key.

Before you start: create an OpenAI API key at https://platform.openai.com/api-keys AND complete Organization Verification at https://platform.openai.com/settings/organization/general (required for gpt-image-2, takes up to 15 min to activate).',
  'צרו וערכו תמונות עם gpt-image-2 של OpenAI — המודל החדש להפקת תמונות. תומך בתמונות ייחוס, עריכה ממוסכת, ועד 4K. השלמה ליום 1 (Gemini 3 Pro) כשצריך פלט בסגנון OpenAI או אין מפתח Gemini.

לפני שמתחילים: צרו מפתח API ב-https://platform.openai.com/api-keys וגם השלימו Organization Verification ב-https://platform.openai.com/settings/organization/general (חובה ל-gpt-image-2, לוקח עד 15 דקות להתפעל).',
  'OpenAI gpt-image-2',
  'Image',
  'https://github.com/guyaga/10d10s-bonus-gpt2-image',
  '/course/guides/bonus-gpt2-image.html',
  true,
  'Install the gpt2-image skill from https://github.com/guyaga/10d10s-bonus-gpt2-image and run `npm install openai --prefix ~/.claude/skills/gpt2-image` to install the SDK. Then verify it works by generating a test image: a photorealistic beige coffee mug on a wooden table, save to test-mug.png.',
  '[
    {
      "n": 1,
      "link": "https://platform.openai.com/api-keys",
      "desc_en": "Sign in to OpenAI, click Create new secret key, copy the key (starts with sk-) and save it. You will paste it in Step 3.",
      "desc_he": "היכנסו ל-OpenAI, לחצו Create new secret key, העתיקו את המפתח (מתחיל ב-sk-) ושמרו אותו. תדביקו אותו בשלב 3.",
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
      "desc_en": "Set OPENAI_API_KEY as an environment variable so the skill can read it. Mac/Linux: export OPENAI_API_KEY=sk-... | Windows PowerShell: $env:OPENAI_API_KEY=\"sk-...\". Add it to your shell profile so it persists across sessions.",
      "desc_he": "הגדירו את OPENAI_API_KEY כמשתנה סביבה כדי שהסקיל יוכל לקרוא אותו. Mac/Linux: export OPENAI_API_KEY=sk-... | Windows PowerShell: $env:OPENAI_API_KEY=\"sk-...\". הוסיפו לפרופיל הטרמינל כדי שיישמר בין הפעלות.",
      "title_en": "Set OPENAI_API_KEY",
      "title_he": "הגדירו את OPENAI_API_KEY"
    },
    {
      "n": 4,
      "desc_en": "Open Claude Code, paste this prompt, and Claude will clone the skill, install the SDK, and run a test image to confirm everything works.",
      "desc_he": "פתחו את Claude Code, הדביקו את הפרומפט הזה, ו-Claude יוריד את הסקיל, יתקין את ה-SDK, ויריץ תמונת בדיקה לוודא שהכל עובד.",
      "title_en": "Install the skill via Claude Code",
      "title_he": "התקינו את הסקיל דרך Claude Code",
      "copy_text": "Install the gpt2-image skill from https://github.com/guyaga/10d10s-bonus-gpt2-image and run `npm install openai --prefix ~/.claude/skills/gpt2-image` to install the SDK. Then verify it works by generating a test image: a photorealistic beige coffee mug on a wooden table, save to test-mug.png.",
      "copy_label_en": "Paste this into Claude Code",
      "copy_label_he": "הדביקו את זה ל-Claude Code"
    }
  ]'::jsonb,
  '[
    {
      "prompt": "Generate a 1024x1024 photorealistic product shot of a beige ceramic coffee mug on a light oak table, soft morning light from the left, shallow depth of field. quality=high",
      "title_en": "Photorealistic product shot",
      "title_he": "תצלום מוצר פוטוריאליסטי",
      "result_image": ""
    },
    {
      "prompt": "Generate a 1024x1536 minimalist Swiss-design poster with the headline \"FUTURE\" in bold black condensed sans-serif on paper-beige background, a signal-red circle behind the letter U. quality=medium",
      "title_en": "Typographic poster",
      "title_he": "כרזה טיפוגרפית",
      "result_image": ""
    },
    {
      "prompt": "Use gpt2-image with reference images of 4 products I will attach, generate a gift basket on white background labeled \"Relax & Unwind\", quality=high",
      "title_en": "Multi-image composition",
      "title_he": "הרכבה ממספר תמונות",
      "result_image": ""
    }
  ]'::jsonb
);
