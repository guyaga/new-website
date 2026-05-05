// Terminal demo codes per skill (from Anthropic design bundle)
export const SKILL_CODES = {
  '01': '$ claude skill run images\n> a clean product shot of a\n  leather wallet on cream paper\n[✓] generated 01.png in 4.2s',
  '02': '$ claude skill run analyze video.mp4\n> scene 00:03 — intro\n> scene 01:12 — product shot\n[✓] transcript.srt',
  '03': '$ claude skill run edit\n> cut 00:00-00:04\n> add captions (he)\n[✓] final.mp4 (720p)',
  '04': '$ claude skill run generate-video\n> "a cat walks through\n  a neon-lit tokyo alley"\n[✓] 04.mp4 (6s, 1080p)',
  '05': '$ claude skill run voice\n> text: "welcome back to"\n> voice: my-clone\n[✓] narration.mp3 (12s)',
  '06': '$ claude skill run research\n> url: competitor.com/pricing\n[✓] extracted 12 plans,\n    2 changed since last run',
  '07': '$ claude skill run post\n> caption, 4 platforms\n> schedule: tomorrow 09:00\n[✓] queued on IG, LI, TT, X',
  '08': '$ claude skill run whatsapp\n> on: new message\n> reply: triage + route\n[✓] 23 threads handled today',
  '09': '$ claude skill run pptx\n> outline.md → deck\n[✓] deck.pptx (12 slides,\n    brand-applied, editable)',
  '10': '$ claude skill run ship\n> deploy to netlify\n> connect domain\n[✓] https://yoursite.com LIVE',
};

export const SKILL_GROUPS = {
  '01': 'CREATE', '02': 'CREATE', '03': 'CREATE', '04': 'CREATE', '05': 'CREATE',
  '06': 'MANAGE', '07': 'MANAGE', '08': 'MANAGE',
  '09': 'BUILD', '10': 'BUILD',
};

// Who-this-is-for items
export const WHO_ITEMS = [
  {
    tEn: 'Content creators', tHe: 'יוצרי תוכן',
    dEn: 'Ship images, videos, voiceovers, and posts — without learning design tools.',
    dHe: 'מייצרים תמונות, סרטונים, קריינות ופוסטים — בלי ללמוד עיצוב.',
  },
  {
    tEn: 'Marketers & founders', tHe: 'משווקים ובעלי עסקים',
    dEn: "Produce marketing assets at a pace that wasn't possible a year ago.",
    dHe: 'מייצרים חומרים שיווקיים בקצב שלא היה אפשרי לפני שנה.',
  },
  {
    tEn: 'Freelancers', tHe: 'פרילנסרים',
    dEn: 'Offer new services — video, sites, decks — without expanding your stack.',
    dHe: 'מציעים שירותים חדשים — וידאו, אתרים, מצגות — בלי להרחיב את ה-stack.',
  },
  {
    tEn: 'The quietly curious', tHe: 'הסקרנים השקטים',
    dEn: "Understand what's actually possible with AI beyond the chat window.",
    dHe: 'מבינים מה באמת אפשר לעשות עם AI מעבר לחלון הצ׳אט.',
  },
];

// What you get cards
export const GET_CARDS = [
  { n: '10', tEn: 'Video lessons', tHe: 'שיעורי וידאו', dEn: '20–30 minutes each. Practical, never lectures.', dHe: '20–30 דקות. מעשיים, לא הרצאות.' },
  { n: '10', tEn: 'GitHub repos', tHe: 'מאגרי GitHub', dEn: 'Every skill ships with code, install guide, docs.', dHe: 'כל סקיל עם קוד, הוראות התקנה ותיעוד.' },
  { n: '10', tEn: 'Hebrew guides', tHe: 'מדריכים בעברית', dEn: 'Detailed per-skill: APIs, pricing, examples.', dHe: 'מפורט לכל סקיל: API, תמחור, דוגמאות.' },
  { n: '∞', tEn: 'Your tools', tHe: 'הכלים שלכם', dEn: 'Installed on your machine. Yours forever.', dHe: 'מותקנים על המחשב שלכם. לתמיד.' },
];

// FAQ
export const FAQ_ITEMS = [
  { qEn: 'Do I need to know how to code?', qHe: 'צריך ניסיון בתכנות?', aEn: 'No. Claude Code writes the code. You describe what you want in plain language — English or Hebrew.', aHe: 'לא. Claude Code כותב את הקוד. אתם מתארים מה אתם רוצים בשפה רגילה — עברית או אנגלית.' },
  { qEn: 'Which Claude subscription do I need?', qHe: 'איזה מנוי Claude צריך?', aEn: "Max ($100/mo) is strongly recommended. Pro ($20) technically works but you'll hit limits fast.", aHe: 'Max ($100/חודש) מומלץ בחום. Pro ($20) אפשרי אבל תגיעו למגבלות מהר.' },
  { qEn: 'What do the external services cost?', qHe: 'כמה עולים השירותים החיצוניים?', aEn: 'Around $50 total across all ten days. Every service is pay-as-you-go — you only pay for what you use.', aHe: 'בערך $50 סה״כ לכל עשרת הימים. כל שירות הוא תשלום לפי שימוש בלבד.' },
  { qEn: 'How long do I have access?', qHe: 'לכמה זמן יש גישה?', aEn: 'One year of access to all materials. The skills themselves install on your machine — those are yours forever.', aHe: 'שנה שלמה לכל החומרים. הסקילים עצמם מותקנים על המחשב שלכם — אלו שלכם לתמיד.' },
  { qEn: 'Is the course in Hebrew?', qHe: 'הקורס בעברית?', aEn: 'Videos and written guides are in Hebrew. The code is in English (industry standard).', aHe: 'הסרטונים והמדריכים בעברית. הקוד באנגלית (תקן התעשייה).' },
  { qEn: "Is the community really active?", qHe: 'הקהילה באמת פעילה?', aEn: "Yes — it's a members-only WhatsApp group. Small, active, and I'm in it every day answering questions alongside other students who are building.", aHe: 'כן — קבוצת וואטסאפ סגורה רק לחברי הקורס. קטנה, פעילה, ואני נוכח בה כל יום יחד עם סטודנטים אחרים שבונים.' },
];

// Pricing
export const PRICE_DATA = {
  price: '₪1,199',
  noteEn: 'Early-bird presale. Price rises at launch.',
  noteHe: 'הרשמה מוקדמת. המחיר עולה בהשקה.',
  includesEn: [
    '10 video lessons in Hebrew',
    '10 Claude Code skills installed on your machine',
    '10 GitHub repos with full source',
    'Detailed written guides per skill',
    '4 bonus skills included (GPT Image 2, Playwright, Chrome DevTools, Storyboard Studio)',
    'Members-only WhatsApp community — with Guy in it',
    '1 year access to course materials',
  ],
  includesHe: [
    '10 שיעורי וידאו בעברית',
    '10 סקילים של Claude Code מותקנים',
    '10 מאגרי GitHub עם קוד מלא',
    'מדריכים כתובים מפורטים לכל סקיל',
    '4 סקילים בונוס כלולים (GPT Image 2, Playwright, Chrome DevTools, Storyboard Studio)',
    'קהילת וואטסאפ סגורה רק לחברים — וגיא בפנים',
    'שנה של גישה לחומרי הקורס',
  ],
  stackEn: [
    { k: 'Claude Max subscription', v: '$100/mo', n: 'Recommended. Pro ($20) hits limits fast.' },
    { k: 'External API services', v: '~$50 total', n: 'Pay-as-you-go. Images, video, voice, publishing.' },
  ],
  stackHe: [
    { k: 'מנוי Claude Max', v: '$100/חודש', n: 'מומלץ. Pro ($20) יגיע למגבלות מהר.' },
    { k: 'שירותי API חיצוניים', v: '~$50 סה״כ', n: 'תשלום לפי שימוש. תמונות, וידאו, קול, פרסום.' },
  ],
  ctaEn: 'Reserve your seat',
  ctaHe: 'שמירת מקום',
  guaranteeEn: "You'll finish with ten tools running locally. If you don't — full refund.",
  guaranteeHe: 'תסיימו עם עשרה כלים שרצים על המחשב. לא הצלחתם? החזר מלא.',
};

// Testimonials (placeholder — swap with real ones)
export const TESTIMONIALS = {
  count: '51',
  countLabelEn: 'people already joined',
  countLabelHe: 'כבר הצטרפו',
  quotes: [
    { qEn: 'I built a full landing page on day 10. The whole thing. In twenty minutes.', qHe: 'ביום 10 בניתי אתר נחיתה שלם. בעצמי. בעשרים דקות.', byEn: 'Shir M.', byHe: 'שיר מ.', roleEn: 'Freelance designer', roleHe: 'מעצבת פרילנסרית' },
    { qEn: "I've taken a lot of AI courses. This one installs on your machine. Big difference.", qHe: 'עברתי הרבה קורסי AI. זה אחד שמתקין דברים על המחשב. הבדל גדול.', byEn: 'Amit K.', byHe: 'עמית ק.', roleEn: 'Product lead', roleHe: 'ראש מוצר' },
    { qEn: 'Three clients booked in the week after day 05. The voice skill alone paid for the course.', qHe: 'שלושה לקוחות נסגרו השבוע אחרי יום 05. סקיל הקול לבד החזיר את הקורס.', byEn: 'Noa D.', byHe: 'נועה ד.', roleEn: 'Content strategist', roleHe: 'אסטרטגית תוכן' },
  ],
};

// Hero ticker items
export const TICKER_EN = ['TEN DAYS', 'TEN SKILLS', 'CLAUDE CODE', 'BUILD FOR REAL', 'IMAGE · VIDEO · AUDIO · WEB · APPS'];
export const TICKER_HE = ['10 ימים', '10 סקילים', 'CLAUDE CODE', 'בונים באמת', 'תמונות · וידאו · קול · רשת · אפליקציות'];

export const SKILLS = [
  {
    day: '01',
    nameEn: 'Image Generation',
    nameHe: 'יצירת תמונות',
    tool: 'Gemini 3 Pro',
    promiseEn: 'Generate a branded image end-to-end in under 30 seconds.',
    promiseHe: 'צרו תמונה ממותגת מקצה לקצה בפחות מ-30 שניות.',
    bulletsEn: [
      'Five prompting frameworks — text-to-image, multimodal reference, semantic masking, Google Search grounding, text localization',
      'Up to 14 reference images (6 objects + 5 human, with face consistency enforced)',
      'Six aspect ratios × three resolutions (1K / 2K / 4K), constraint-validated before every call',
      'Multi-turn chat with thought signatures — interim "thinking" images surface for free',
    ],
    bulletsHe: [
      'חמישה פריימוורקים — טקסט-לתמונה, ייחוס מולטי-מודאלי, מסכה סמנטית, עיגון ל-Google, לוקליזציה של טקסט',
      'עד 14 תמונות ייחוס (6 אובייקטים + 5 פנים עם עקביות פנים מובנית)',
      'שישה יחסי גובה/רוחב × שלוש רזולוציות (1K / 2K / 4K), עם ולידציה לפני כל קריאה',
      'צ\'אט מרובה-סיבובים עם חתימות מחשבה — תמונות ביניים חושפות את "החשיבה" חינם',
    ],
    buildEn: 'A launch campaign — hero image, three variations, social crops for five platforms.',
    buildHe: 'קמפיין השקה — תמונת גיבור, שלוש וריאציות, קרופים ל-5 פלטפורמות.',
  },
  {
    day: '02',
    nameEn: 'Video Analysis',
    nameHe: 'ניתוח וידאו',
    tool: 'Gemini 3.1 Pro',
    promiseEn: 'Understand any video — scenes, transcription, emotion, moment-by-moment.',
    promiseHe: 'הבינו כל סרטון — סצנות, תמלול, רגש, רגע אחרי רגע.',
    bulletsEn: [
      'Eight prompting frameworks — full analysis, ad review, emotion-tagged transcription, SRT captions, ffmpeg prep, QA, competitor teardown, audio translation',
      'Three input methods with documented failure modes — File API (≤20GB), inline (<100MB), YouTube URLs',
      'Token economics table — ~300 tok/s video, 32 tok/s audio, auto-downsample to 16Kbps mono',
      'Structured JSON schemas enforcing timestamp / content / language / emotion per segment',
    ],
    bulletsHe: [
      'שמונה פריימוורקים — ניתוח מלא, סקירת פרסומת, תמלול עם רגשות, כתוביות SRT, הכנה ל-ffmpeg, QA, פירוק מתחרה, תרגום אודיו',
      'שלוש שיטות קלט עם טיפול בכשלים מתועד — File API (עד 20GB), inline (עד 100MB), כתובות YouTube',
      'טבלת כלכלת טוקנים — ~300 tok/s וידאו, 32 tok/s אודיו, דאונסמפלינג ל-16Kbps מונו',
      'סכמות JSON מובנות האוכפות חתימת זמן / תוכן / שפה / רגש לכל קטע',
    ],
    buildEn: 'A transcript plus emotional scene map of a real YouTube video.',
    buildHe: 'תמלול ומפת סצנות רגשית של סרטון YouTube אמיתי.',
  },
  {
    day: '03',
    nameEn: 'Video Editing',
    nameHe: 'עריכת וידאו',
    tool: 'ffmpeg + yt-dlp',
    promiseEn: 'Trim, subtitle, and ship a reel without opening Premiere.',
    promiseHe: 'חתכו, תייגו כתוביות ושלחו Reel בלי לפתוח Premiere.',
    bulletsEn: [
      'Ten operations — trim, silence detect/remove, podcast normalize, subtitle burn-in, audio extraction, YouTube download, shorts, concat, batch, effects',
      'Silence-aware auto-editor — silencedetect + dynamic trim/concat filter composition above 1.5s',
      'Four quality presets (CRF 18–28) plus lossless -c copy mode for instant trimming',
      'Six social presets — IG 1:1, TikTok 9:16, YouTube 16:9, LinkedIn 4:3',
    ],
    bulletsHe: [
      'עשר פעולות — חיתוך, זיהוי והסרת שקט, נרמול פודקאסט, כתוביות צרובות, חילוץ אודיו, הורדת YouTube, shorts, איחוד, batch, אפקטים',
      'עורך אוטומטי מודע שתיקות — silencedetect עם הרכבת פילטרים דינמית מעל 1.5 שניות',
      'ארבעה פריסטים לאיכות (CRF 18–28) פלוס מצב לוסלס -c copy לחיתוך מיידי',
      'שישה פריסטים לסושיאל — IG 1:1, טיקטוק 9:16, יוטיוב 16:9, לינקדאין 4:3',
    ],
    buildEn: 'A full podcast edit — silences removed, subtitles burned, shorts cut for three platforms.',
    buildHe: 'עריכת פודקאסט מלאה — שתיקות הוסרו, כתוביות נצרבו, shorts לשלוש פלטפורמות.',
  },
  {
    day: '04',
    nameEn: 'Video Generation',
    nameHe: 'יצירת וידאו',
    tool: 'fal.ai MCP',
    promiseEn: 'Turn a still image into a cinematic 8-second shot.',
    promiseHe: 'הפכו תמונה אחת לשוט קולנועי באורך 8 שניות.',
    bulletsEn: [
      'Eight video models ranked by quality + price — Veo 3.1, Kling 3 Pro, LTX-2, Minimax, Seedance and more',
      'Four workflow patterns — text-to-video, image-to-video, first+last-frame controlled, full pipeline',
      'Cinematic camera vocabulary — slow pans, dolly zooms, handheld, aerial drone shots',
      'Pre-generation checklist prevents wasted credits — fidelity, prompt review, tier, duration, balance',
    ],
    bulletsHe: [
      'שמונה מודלי וידאו מדורגים לפי איכות ומחיר — Veo 3.1, Kling 3 Pro, LTX-2, Minimax, Seedance ועוד',
      'ארבעה דפוסי עבודה — טקסט-לווידאו, תמונה-לווידאו, פריים ראשון ואחרון, פייפליין הפקה מלא',
      'אוצר מילים קולנועי — פאנים איטיים, דולי זום, רעד יד, שוטים אוויריים',
      'צ\'קליסט טרום-הפקה שמונע בזבוז קרדיטים — נאמנות, סקירת פרומפט, מודל, משך, יתרה',
    ],
    buildEn: 'A 30-second AI reel from three still product images.',
    buildHe: 'Reel של 30 שניות משלוש תמונות מוצר.',
  },
  {
    day: '05',
    nameEn: 'Voice & Audio',
    nameHe: 'קול ואודיו',
    tool: 'ElevenLabs',
    promiseEn: 'Clone your voice, score a scene, create any sound effect — without a studio.',
    promiseHe: 'שכפלו את הקול, חברו פסקול, צרו כל אפקט — בלי אולפן.',
    bulletsEn: [
      'Four TTS models with explicit trade-offs — V3, Multilingual V2, Flash (75ms), Turbo',
      'Voice cloning protocol — 1–3 min clean samples with five preparation rules',
      'Four voice presets with exact settings — narration, marketing, meditation, character',
      'Music + SFX generation with mood templates and five SFX categories',
    ],
    bulletsHe: [
      'ארבעה מודלי TTS עם טרייד-אופים — V3, Multilingual V2, Flash (75ms), Turbo',
      'פרוטוקול שכפול קול — 1–3 דקות דגימות נקיות עם חמישה כללי הקלטה',
      'ארבעה פריסטים עם הגדרות מדויקות — קריינות, שיווק, מדיטציה, דמות',
      'יצירת מוזיקה ו-SFX עם תבניות מצב רוח וחמש קטגוריות SFX',
    ],
    buildEn: 'A narrated product explainer with your cloned voice and a custom music bed.',
    buildHe: 'סרטון הסבר מוצר עם הקול המשוכפל שלכם ומוזיקת רקע.',
  },
  {
    day: '06',
    nameEn: 'Web Intelligence',
    nameHe: 'אינטליגנציית רשת',
    tool: 'Firecrawl',
    promiseEn: 'Scrape any site, extract a brand profile, map a competitor in minutes.',
    promiseHe: 'סרקו כל אתר, חלצו פרופיל מותג, מפו מתחרה תוך דקות.',
    bulletsEn: [
      'Five-part brand profile extraction — identity, visual identity, voice, audience, social + contact',
      'Logo download pipeline — PNG/JPG direct, SVG→PNG conversion, WEBP fallback',
      'Markdown + structured JSON extraction with property validation schemas',
      'Three documented use cases — brand profile builder, competitor analysis, publishing-frequency research',
    ],
    bulletsHe: [
      'חילוץ פרופיל מותג בחמישה חלקים — זהות, זהות חזותית, קול, קהל, סושיאל + יצירת קשר',
      'פייפליין להורדת לוגו — PNG/JPG ישירות, המרת SVG→PNG, נפילה ל-WEBP',
      'Markdown + JSON מובנה עם סכמות ולידציה למאפיינים',
      'שלושה מקרי שימוש — בניית פרופיל מותג, ניתוח מתחרים, מחקר תדירות פרסום',
    ],
    buildEn: 'A full brand profile plus a three-competitor map for a live website.',
    buildHe: 'פרופיל מותג שלם ומפה של שלושה מתחרים לאתר חי.',
  },
  {
    day: '07',
    nameEn: 'Social Media',
    nameHe: 'סושיאל מדיה',
    tool: 'Upload Post API',
    promiseEn: 'Design and publish a carousel to every platform in one run.',
    promiseHe: 'עצבו ופרסמו קרוסלה לכל הפלטפורמות בהרצה אחת.',
    bulletsEn: [
      'Eleven platforms with per-platform post-type rules — feed, stories, carousels, reels, videos, posts',
      'Seven-slide carousel framework grounded in engagement science — hook, context, four value points, CTA',
      'Six aspect ratios with exact pixel specs — IG 1:1 @1080, Pinterest 2:3 @1500, LinkedIn 4:3 @1080',
      'Three safety gates before publishing — image preview, caption approval, multi-platform confirmation',
    ],
    bulletsHe: [
      'אחת-עשרה פלטפורמות עם חוקים לכל סוג פוסט — פיד, סטוריז, קרוסלות, ריילס, סרטונים, פוסטים',
      'מסגרת קרוסלה של שבעה סלייד מבוססת מדע מעורבות — הוק, הקשר, ארבע נקודות ערך, CTA',
      'שישה יחסי מסך עם ספקים בפיקסלים — IG 1:1 @1080, פינטרסט 2:3 @1500, לינקדאין 4:3 @1080',
      'שלושה שערי בטיחות לפני פרסום — תצוגה מקדימה, אישור כיתוב, אישור רב-פלטפורמתי',
    ],
    buildEn: 'A seven-slide carousel auto-published to five platforms, previewed first.',
    buildHe: 'קרוסלת שבעה סלייד שמתפרסמת לחמש פלטפורמות, עם תצוגה מקדימה.',
  },
  {
    day: '08',
    nameEn: 'WhatsApp',
    nameHe: 'וואטסאפ',
    tool: 'Green API',
    promiseEn: 'Send messages, run flows, never trigger a ban.',
    promiseHe: 'שלחו הודעות, הריצו פלואים, ולא תתפסו לחסימה.',
    bulletsEn: [
      'Four risk tiers documented — safe (self), normal (known), caution (unverified), dangerous (groups + bulk)',
      'Ten-day account warm-up schedule — 0 → 5–10 → 12–20 → 50–100 → 200 messages/day',
      'Ten anti-ban rules baked in — 15-second delays, 50%+ response rate, personalization, 200/day cap',
      'Phone normalization for five countries — strips leading zero, adds country code, appends @c.us',
    ],
    bulletsHe: [
      'ארבע רמות סיכון מתועדות — בטוח (עצמי), רגיל (מוכרים), זהירות (לא מאומת), מסוכן (קבוצות + בולק)',
      'לו״ז חימום חשבון לעשרה ימים — 0 → 5–10 → 12–20 → 50–100 → 200 הודעות ביום',
      'עשרה כללי הגנה מחסימה — עיכוב 15 שניות, יחס מענה 50%+, פרסונליזציה, תקרת 200 ביום',
      'נרמול מספרי טלפון לחמש מדינות — מסיר אפס מוביל, מוסיף קוד מדינה, מוסיף @c.us',
    ],
    buildEn: 'A lead-reply flow that warms the account and sends safely to real contacts.',
    buildHe: 'פלואו תגובה לליד שמחמם את החשבון ושולח בבטחה לאנשי קשר אמיתיים.',
  },
  {
    day: '09',
    nameEn: 'Presentations',
    nameHe: 'מצגות',
    tool: 'python-pptx + Gemini',
    promiseEn: 'A 15-slide branded deck with a real story, not a template.',
    promiseHe: 'מצגת ממותגת של 15 שקפים עם סיפור אמיתי, לא תבנית.',
    bulletsEn: [
      'Nineteen slide-type catalog (11 dark, 6 light, 2 accent) enforcing a no-repeat-adjacent layout rule',
      'Three storytelling frameworks — Why This Matters, The Journey, Teach & Inspire (Monroe\'s sequence)',
      'Four-color system with proportional rules — 60% primary, 15–20% secondary, 2–3% accent',
      'Thirteen design rules — no 3-column grids, 30% white space, 6 bullets max, eight banned slop words',
    ],
    bulletsHe: [
      'קטלוג של 19 סוגי שקפים (11 כהים, 6 בהירים, 2 אקצנט) עם כלל אי-חזרה צמודה',
      'שלוש מסגרות סיפור — למה זה חשוב, המסע, ללמד ולהלהיב (רצף מונרו)',
      'מערכת של ארבעה צבעים — 60% ראשי, 15–20% משני, 2–3% אקצנט',
      'שלושה-עשר כללי עיצוב — אין גריד 3-עמודות, 30% רווח לבן, מקסימום 6 בולטים, 8 מילות סלופ אסורות',
    ],
    buildEn: 'A 15-slide pitch deck from a one-paragraph brief, with a chosen storytelling arc.',
    buildHe: 'פיצ\'דק של 15 שקפים מפסקת בריף אחת, עם קשת סיפור נבחרת.',
  },
  {
    day: '10',
    nameEn: 'Landing Pages',
    nameHe: 'אתרי נחיתה',
    tool: 'React + Vite + GSAP',
    promiseEn: 'Brief to live site, in an afternoon.',
    promiseHe: 'מבריף לאתר חי, בצהריים אחד.',
    bulletsEn: [
      'Four aesthetic presets with named palettes — Organic Tech, Midnight Luxe, Brutalist Signal, Vapor Clinic',
      'Seven component patterns — floating navbar, 100dvh hero, three card micro-UIs, manifesto, sticky protocol, pricing, footer',
      'Fixed design language — SVG noise overlay at 5%, GSAP power3.out, rounded-[2rem], 0.08s / 0.15s stagger',
      'SEO + JSON-LD + llms.txt file — AI crawlers read your brand brief correctly',
    ],
    bulletsHe: [
      'ארבעה פריסטים עם פלטות — Organic Tech, Midnight Luxe, Brutalist Signal, Vapor Clinic',
      'שבעה דפוסי רכיב — ניווט צף, הירו 100dvh, שלושה כרטיסים, מניפסט, פרוטוקול דביק, מחיר, פוטר',
      'שפת עיצוב קבועה — שכבת רעש SVG ב-5%, GSAP power3.out, rounded-[2rem], סטאגר 0.08s / 0.15s',
      'SEO + JSON-LD + קובץ llms.txt — סורקי AI יקראו את בריף המותג נכון',
    ],
    buildEn: 'A live, deployed landing page from a one-paragraph brief — with SEO and AI-readable metadata.',
    buildHe: 'אתר נחיתה חי ומפורסם מפסקה אחת של בריף — עם SEO ומטא לקריאת AI.',
  },
];

export const BONUSES = [
  {
    nameEn: 'GPT Image 2',
    nameHe: 'GPT Image 2',
    tool: 'OpenAI gpt-image-2',
    descEn: 'Photorealistic generation + surgical edits with "change only X, keep everything else" protocol.',
    descHe: 'יצירה פוטוריאליסטית + עריכות כירורגיות עם פרוטוקול "שנה רק X, שמור על השאר".',
  },
  {
    nameEn: 'Playwright MCP',
    nameHe: 'Playwright MCP',
    tool: 'Microsoft',
    descEn: 'Let Claude Code drive a real browser — click, fill, scrape, automate.',
    descHe: 'תנו ל-Claude Code להפעיל דפדפן אמיתי — ללחוץ, למלא, לסרוק, לאוטמט.',
  },
  {
    nameEn: 'Chrome DevTools MCP',
    nameHe: 'Chrome DevTools MCP',
    tool: 'Google',
    descEn: 'Inspect, debug, and profile live pages from inside Claude Code.',
    descHe: 'בדקו, דבגו וצפו בביצועים של דפים חיים מתוך Claude Code.',
  },
  {
    nameEn: 'Storyboard Studio',
    nameHe: 'סטודיו לסטוריבורד',
    tool: 'Gemini 3 Pro pipeline',
    descEn: 'One-sentence concept to full video storyboard — hero character locked across 5–15 scenes with VEO + Kling prompts.',
    descHe: 'מקונספט משפט אחד לסטוריבורד וידאו שלם — דמות ראשית נעולה על פני 5–15 סצנות עם פרומפטים ל-VEO ו-Kling.',
  },
];

export const RENT_LOGOS = [
  'Canva Pro', 'CapCut Pro', 'ElevenLabs', 'Descript', 'Midjourney',
  'HeyGen', 'Synthesia', 'Runway', 'Submagic', 'Gamma',
];

export const OWN_LINES = [
  'image-generation', 'video-analysis', 'video-editing', 'video-generation',
  'voice-audio', 'web-intelligence', 'social-media', 'whatsapp-messenger',
  'presentations', 'landing-pages',
  'gpt2-image', 'playwright-mcp', 'chrome-devtools-mcp', 'storyboard-studio',
];

export const ROLE_LABELS_EN = [
  'SENIOR MARKETER', 'CONTENT DIRECTOR', 'FOUNDER', 'CREATIVE DIRECTOR',
  'BRAND STRATEGIST', 'GROWTH LEAD', 'PRODUCT DESIGNER', 'PODCAST HOST',
  'COPYWRITER', 'AGENCY OWNER',
];

export const ROLE_LABELS_HE = [
  'אנשי שיווק בכירים', 'מנהלי תוכן', 'יזמים', 'מנהלי קריאייטיב',
  'אסטרטגי מותג', 'מובילי צמיחה', 'מעצבי מוצר', 'מנחי פודקאסט',
  'קופירייטרים', 'בעלי סוכנויות',
];

export const CREDENTIALS = [
  { en: 'Founder, AI Academy', he: 'מייסד, AI Academy' },
  { en: 'Built AdGPT', he: 'בנה את AdGPT' },
  { en: 'Taught at Technion', he: 'לימד בטכניון' },
  { en: '5,000+ students shipped', he: '5,000+ תלמידים שלחו עבודה לדרך' },
  { en: 'Clients: IBI, Strauss, Maccabi, AIG', he: 'לקוחות: IBI, שטראוס, מכבי, AIG' },
];

export const TERMINAL_SCENARIOS = [
  {
    inputEn: 'generate a launch reel for my coffee brand, 30 seconds',
    inputHe: 'צור Reel השקה למותג הקפה שלי, 30 שניות',
    stepsEn: ['image → video → voice → subtitles → social crops'],
    stepsHe: ['תמונה → וידאו → קול → כתוביות → קרופים לסושיאל'],
    resultEn: '✓ ready in 4m 12s',
    resultHe: '✓ מוכן ב-4:12',
    captionEn: 'You described it. Claude built it.',
    captionHe: 'אתם תיארתם. Claude בנה.',
  },
  {
    inputEn: 'translate all slides in this deck to Hebrew, keep layout',
    inputHe: 'תרגם את כל השקפים למצגת לעברית, שמור על הלייאאוט',
    stepsEn: ['extracted 28 slides → translated → rebuilt with RTL'],
    stepsHe: ['חולצו 28 שקפים → תורגמו → נבנו מחדש ב-RTL'],
    resultEn: '✓ saved as deck_he.pptx',
    resultHe: '✓ נשמר כ-deck_he.pptx',
    captionEn: 'No human-in-the-loop gymnastics.',
    captionHe: 'בלי התחכמויות של אדם-בלופ.',
  },
  {
    inputEn: 'build a landing page for my pre-launch, publish it',
    inputHe: 'בנה אתר נחיתה למכירה מוקדמת ופרסם',
    stepsEn: ['draft copy → design → code → deploy to Netlify'],
    stepsHe: ['טיוטת קופי → עיצוב → קוד → פריסה ל-Netlify'],
    resultEn: '✓ live at your-domain.netlify.app',
    resultHe: '✓ חי ב-your-domain.netlify.app',
    captionEn: 'Brief in. Site out.',
    captionHe: 'בריף נכנס. אתר יוצא.',
  },
];
