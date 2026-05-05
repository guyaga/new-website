-- Fourth bonus: Storyboard Studio — end-to-end video storyboard pipeline.
-- Uses Gemini 3 Pro for image generation (same key as Day 1), writes VEO 3.1 + Kling 3.0 prompts,
-- assembles a Swiss-design HTML deliverable with character consistency locked via reference image.

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
  'Storyboard Studio',
  'סטודיו לסטוריבורד',
  'Turn a one-line concept into a full video storyboard — hero character + props + locations + 5–15 scene images with the same character locked across every shot, plus VEO 3.1 and Kling 3.0 prompts ready to paste into the video models. Get back a Swiss-design HTML you can export as PDF with one click.

Requires Day 1 (Image Generation) — uses the same GEMINI_API_KEY. Typical run: $3–5 in image generation calls.',
  'הפכו קונספט במשפט אחד לסטוריבורד וידאו שלם — דמות ראשית + אביזרים + לוקיישנים + 5–15 תמונות סצנה עם אותה דמות נעולה בכל שוט, פלוס פרומפטים של VEO 3.1 ו-Kling 3.0 מוכנים להדבקה במודלי הווידאו. מקבלים בחזרה HTML בעיצוב שוויצרי שאפשר לייצא ל-PDF בלחיצה.

דורש את יום 1 (יצירת תמונות) — משתמש באותו GEMINI_API_KEY. ריצה טיפוסית: $3–5 בקריאות API ליצירת תמונות.',
  'Video Storyboard · Gemini 3 Pro',
  'Film',
  'https://github.com/guyaga/10d10s-bonus-storyboard-studio',
  '/course/guides/bonus-storyboard-studio.html',
  true,
  'Install the storyboard-studio skill from https://github.com/guyaga/10d10s-bonus-storyboard-studio and run `npm install @google/genai --prefix ~/.claude/skills/storyboard-studio` to install the SDK. Once installed, test it by running: use the storyboard-studio skill to plan a 30-second IG Reel about a baker opening her Jerusalem bakery at dawn in Auto mode, save to ./bakery-test/',
  '[
    {
      "n": 1,
      "desc_en": "If you completed Day 1 (Image Generation), your GEMINI_API_KEY is already set and this bonus reuses it. If not, complete Day 1 first.",
      "desc_he": "אם סיימתם את יום 1 (יצירת תמונות), ה-GEMINI_API_KEY כבר מוגדר והבונוס הזה ישתמש בו. אם לא, השלימו קודם את יום 1.",
      "title_en": "Prerequisite — Day 1 must be installed",
      "title_he": "דרישה מקדימה — יום 1 חייב להיות מותקן"
    },
    {
      "n": 2,
      "desc_en": "Paste this into Claude Code. It clones the skill from GitHub and installs the Gemini SDK into the skill folder. One-time setup.",
      "desc_he": "הדביקו את זה ל-Claude Code. הוא יוריד את הסקיל מ-GitHub ויתקין את ה-SDK של Gemini בתיקיית הסקיל. הגדרה חד-פעמית.",
      "title_en": "Install the skill",
      "title_he": "התקינו את הסקיל",
      "copy_text": "Install the storyboard-studio skill from https://github.com/guyaga/10d10s-bonus-storyboard-studio and run `npm install @google/genai --prefix ~/.claude/skills/storyboard-studio` to install the SDK.",
      "copy_label_en": "Paste into Claude Code",
      "copy_label_he": "הדביקו ב-Claude Code"
    },
    {
      "n": 3,
      "desc_en": "Ask Claude to make a storyboard. Just describe the video in a sentence or two. Claude will ask a few confirmation questions (duration, tone, mode), then run autonomously for ~15 minutes and produce the deliverable. Open the HTML, Ctrl+P to save as PDF.",
      "desc_he": "בקשו מ-Claude ליצור סטוריבורד. פשוט תארו את הוידאו במשפט או שניים. Claude ישאל כמה שאלות לאישור (משך, טון, מצב), ירוץ אוטונומית כ-15 דקות ויפיק את התוצר. פותחים את ה-HTML, Ctrl+P לשמירה כ-PDF.",
      "title_en": "Run your first storyboard",
      "title_he": "הריצו את הסטוריבורד הראשון שלכם",
      "copy_text": "Use the storyboard-studio skill to plan a 30-second IG Reel about a baker opening her Jerusalem bakery at dawn. Auto mode. Save everything to ./bakery-test/",
      "copy_label_en": "Sample test prompt",
      "copy_label_he": "פרומפט לבדיקה"
    }
  ]'::jsonb,
  '[
    {
      "prompt": "Use storyboard-studio to plan a 45-second IG Reel for a new coffee brand launch. A young barista in Tel Aviv, cinematic aspirational tone. Auto mode. Save to ./coffee-launch/",
      "title_en": "Brand launch Reel",
      "title_he": "ריל השקת מותג",
      "result_image": ""
    },
    {
      "prompt": "Use storyboard-studio in Guided mode to build a 60-second product storyboard. I will drop the product photos in inputs/. Generate a hero character that matches the brand, then compose scenes. Save to ./product-storyboard/",
      "title_en": "Product with uploaded assets",
      "title_he": "מוצר עם קבצים שלי",
      "result_image": ""
    },
    {
      "prompt": "Use storyboard-studio to plan a 90-second cinematic narrative video (15 shots, ~6 sec each). Character: an elderly Israeli grandfather teaching his grandson chess on a Jerusalem balcony. Generate everything. Save to ./chess-grandfather/",
      "title_en": "Longer cinematic piece",
      "title_he": "סרט נרטיבי ארוך יותר",
      "result_image": ""
    }
  ]'::jsonb
);
