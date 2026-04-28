import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../i18n';
import { getSessions } from '../utils/course';

gsap.registerPlugin(ScrollTrigger);

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

const SKILLS = [
  { day: '01', nameEn: 'Image Generation', nameHe: 'יצירת תמונות', tool: 'Gemini 3 Pro', group: 'create', teaserEn: 'Generate professional images from text', teaserHe: 'צרו תמונות מקצועיות מטקסט' },
  { day: '02', nameEn: 'Video Analysis', nameHe: 'ניתוח וידאו', tool: 'Gemini 3.1 Pro', group: 'create', teaserEn: 'Understand any video — scenes, transcription, emotions', teaserHe: 'הבינו כל סרטון — סצנות, תמלול, רגשות' },
  { day: '03', nameEn: 'Video Editing', nameHe: 'עריכת וידאו', tool: 'ffmpeg', group: 'create', teaserEn: 'Trim, merge, subtitles, create reels', teaserHe: 'חיתוך, מיזוג, כתוביות, יצירת Reels' },
  { day: '04', nameEn: 'Video Generation', nameHe: 'יצירת וידאו', tool: 'fal.ai MCP', group: 'create', teaserEn: 'Create AI videos from images with one prompt', teaserHe: 'צרו סרטוני AI מתמונות בפרומפט אחד' },
  { day: '05', nameEn: 'Voice & Audio', nameHe: 'קול ואודיו', tool: 'ElevenLabs', group: 'create', teaserEn: 'Professional voiceover, music, sound effects', teaserHe: 'קריינות מקצועית, מוזיקה, אפקטים' },
  { day: '06', nameEn: 'Web Intelligence', nameHe: 'אינטליגנציית רשת', tool: 'Firecrawl', group: 'manage', teaserEn: 'Scrape websites, build brand profiles', teaserHe: 'סרקו אתרים, בנו פרופילי מותג' },
  { day: '07', nameEn: 'Social Media', nameHe: 'סושיאל מדיה', tool: 'Upload Post', group: 'manage', teaserEn: 'Design and publish to 11 platforms', teaserHe: 'עצבו ופרסמו ל-11 פלטפורמות' },
  { day: '08', nameEn: 'WhatsApp', nameHe: 'וואטסאפ', tool: 'Green API', group: 'manage', teaserEn: 'Send and receive messages from Claude Code', teaserHe: 'שלחו וקבלו הודעות מ-Claude Code' },
  { day: '09', nameEn: 'Presentations', nameHe: 'מצגות', tool: 'python-pptx', group: 'build', teaserEn: 'Branded PowerPoint decks with storytelling', teaserHe: 'מצגות PowerPoint ממותגות עם סיפור' },
  { day: '10', nameEn: 'Landing Pages', nameHe: 'אתרי נחיתה', tool: 'React + Netlify', group: 'build', teaserEn: 'Build a cinematic page and deploy it live', teaserHe: 'בנו אתר קולנועי ופרסמו אותו' },
];

const FAQ_DATA = [
  { qEn: 'Do I need coding experience?', qHe: 'צריך ניסיון בתכנות?', aEn: 'No. Claude Code handles the code — you describe what you want in plain language.', aHe: 'לא. Claude Code מטפל בקוד — אתם מתארים מה אתם רוצים בשפה רגילה.' },
  { qEn: 'What Claude subscription do I need?', qHe: 'איזה מנוי Claude צריך?', aEn: 'Max ($100/mo) is strongly recommended. Pro ($20) is possible but you\'ll hit limits fast.', aHe: 'Max ($100/חודש) מומלץ בחום. Pro ($20) אפשרי אבל תגיעו למגבלות מהר.' },
  { qEn: 'How much do the API services cost?', qHe: 'כמה עולים השירותים?', aEn: 'About $50 total for the course. Pay-as-you-go — you only pay for what you use.', aHe: 'כ-$50 בסך הכל. תשלום לפי שימוש בלבד.' },
  { qEn: 'Is the course in Hebrew?', qHe: 'הקורס בעברית?', aEn: 'Videos and guides in Hebrew. Code in English (industry standard).', aHe: 'סרטונים ומדריכים בעברית. קוד באנגלית (תקן בתעשייה).' },
  { qEn: 'What will I be able to create?', qHe: 'מה אוכל ליצור?', aEn: 'Images, videos, voiceovers, landing pages, presentations, social posts, WhatsApp automations, and more.', aHe: 'תמונות, סרטונים, קריינות, אתרי נחיתה, מצגות, פוסטים, אוטומציות וואטסאפ ועוד.' },
  { qEn: 'How long do I have access?', qHe: 'לכמה זמן יש גישה?', aEn: 'One year for course hub. Skills are installed on your machine forever.', aHe: 'שנה למרכז הקורס. הסקילים מותקנים על המחשב שלכם לתמיד.' },
];

export default function CoursePage() {
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  return (
    <>
      <Helmet>
        <title>{t('course.meta.title')}</title>
        <meta name="description" content={t('course.meta.desc')} />
        <meta property="og:title" content={t('course.meta.title')} />
        <meta property="og:description" content={t('course.meta.desc')} />
        <meta property="og:image" content="/course/og-image.jpg" />
      </Helmet>

      <main dir={isHe ? 'rtl' : 'ltr'}>
        {/* ══════ HERO ══════ */}
        <section className="relative min-h-[100dvh] flex items-end overflow-hidden bg-black">
          <div className="absolute inset-0">
            <img src="/course/hero.jpg" alt="" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>
          <div className="absolute top-20 start-16 w-px h-40 bg-signal-red/20" />
          <div className="absolute top-32 start-12 w-8 h-8 border border-signal-red/15 rounded-full" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20 md:pb-32 w-full">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 bg-signal-red/10 border border-signal-red/20 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-signal-red rounded-full animate-pulse" />
                <span className="font-mono text-[11px] text-signal-red tracking-wider">PRESALE</span>
              </span>
            </div>

            <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.95] text-white mb-6">
              <span className="block">{isHe ? 'למדו לעבוד' : 'Learn to work'}</span>
              <span className="block text-signal-red">{isHe ? 'עם Claude Code' : 'with Claude Code'}</span>
            </h1>

            <p className="font-sans text-xl md:text-2xl text-white/40 max-w-2xl leading-relaxed font-light mb-10">
              {isHe
                ? '10 סקילים מעשיים שהופכים את Claude Code לכלי עבודה אמיתי. שיעור ביום, סקיל ביום — בסוף תדעו לעשות דברים.'
                : '10 practical skills that make Claude Code a real working tool. One skill per day — by the end, you\'ll know how to get things done.'}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
                className="group bg-signal-red text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-[1.03] transition-transform inline-flex items-center gap-3">
                {isHe ? 'הרשמה מוקדמת' : 'Early Access'}
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform">{isHe ? '←' : '→'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════ WHO IS THIS FOR ══════ */}
        <section className="py-32 md:py-40 bg-black border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-mono text-[11px] text-signal-red tracking-wider mb-4">{isHe ? 'למי זה מתאים' : 'Who is this for'}</p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-white mb-16">
              {isHe ? <>אתם יודעים ש-AI יכול לעזור לכם.<br /><span className="text-white/30">אתם פשוט לא יודעים מאיפה להתחיל.</span></> : <>You know AI can help you.<br /><span className="text-white/30">You just don't know where to start.</span></>}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
              {[
                { en: 'Content Creators', he: 'יוצרי תוכן', descEn: 'Create images, videos, voiceovers, and posts — without learning design', descHe: 'שרוצים ליצור תמונות, סרטונים, קריינות ופוסטים — מבלי ללמוד עיצוב' },
                { en: 'Marketers & Business Owners', he: 'משווקים ובעלי עסקים', descEn: 'Produce marketing materials at a pace that wasn\'t possible before', descHe: 'שרוצים לייצר חומרים שיווקיים בקצב שלא היה אפשרי קודם' },
                { en: 'Freelancers', he: 'פרילנסרים', descEn: 'Offer new services to clients — videos, websites, presentations', descHe: 'שרוצים להציע שירותים חדשים ללקוחות — סרטונים, אתרים, מצגות' },
                { en: 'Anyone Curious', he: 'כל מי שסקרן', descEn: 'Understand what AI can do beyond chat conversations', descHe: 'שרוצה להבין מה אפשר לעשות עם AI מעבר לשיחות צ\'אט' },
              ].map((item, i) => (
                <div key={i} className="bg-black p-8 md:p-10">
                  <h3 className="font-sans font-bold text-lg text-white mb-2">{isHe ? item.he : item.en}</h3>
                  <p className="font-sans text-base text-white/35 leading-relaxed">{isHe ? item.descHe : item.descEn}</p>
                </div>
              ))}
            </div>

            {/* NOT for you */}
            <div className="mt-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10">
              <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-4">{isHe ? 'רגע לפני שנמשיך' : 'Before you continue'}</p>
              <h3 className="font-sans font-bold text-xl text-white mb-6">
                {isHe ? 'הקורס הזה לא מתאים לכולם' : 'This course is not for everyone'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-sans text-sm text-signal-red font-semibold mb-3">{isHe ? 'לא מומלץ אם:' : 'Not recommended if:'}</p>
                  <ul className="space-y-3">
                    {(isHe ? [
                      'אתם לא מרגישים בנוח לעבוד עם כלי AI בכלל',
                      'מונחים טכניים באנגלית מבלבלים אתכם לגמרי',
                      'אתם מחפשים קורס שמלמד מאפס מוחלט בלי שום רקע',
                      'אתם לא מוכנים להתמודד עם בעיות טכניות בדרך',
                    ] : [
                      'You\'re not comfortable using AI tools at all',
                      'English technical terms completely confuse you',
                      'You\'re looking for a course that teaches from absolute zero',
                      'You\'re not willing to troubleshoot technical issues along the way',
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-signal-red/60 mt-0.5 shrink-0">✕</span>
                        <span className="font-sans text-sm text-white/40">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-sans text-sm text-emerald-400/80 font-semibold mb-3">{isHe ? 'כן מתאים אם:' : 'Great fit if:'}</p>
                  <ul className="space-y-3">
                    {(isHe ? [
                      'כבר השתמשתם ב-ChatGPT, Claude או כלי AI אחר',
                      'אתם מוכנים ללמוד דברים חדשים ולנסות',
                      'אתם יודעים לקרוא הודעות שגיאה ולא נבהלים',
                      'אתם רוצים כלים מעשיים, לא רק תיאוריה',
                    ] : [
                      'You\'ve used ChatGPT, Claude, or another AI tool before',
                      'You\'re willing to learn new things and experiment',
                      'You can read error messages without panicking',
                      'You want practical tools, not just theory',
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-emerald-400/60 mt-0.5 shrink-0">✓</span>
                        <span className="font-sans text-sm text-white/40">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="font-sans text-xs text-white/20 mt-6 leading-relaxed">
                {isHe
                  ? 'הקורס דורש סבלנות, נכונות להתנסות, ויכולת בסיסית להתמודד עם בעיות טכניות. Claude Code עוזר בהרבה, אבל זה לא קסם — זו עבודה מעשית.'
                  : 'This course requires patience, willingness to experiment, and basic ability to handle technical issues. Claude Code helps a lot, but it\'s not magic — it\'s practical work.'}
              </p>
            </div>
          </div>
        </section>

        {/* ══════ WHAT YOU GET ══════ */}
        <section className="py-32 md:py-40 bg-off-white text-black">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-mono text-[11px] text-signal-red tracking-wider mb-4">{isHe ? 'מה מקבלים' : 'What you get'}</p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-6">
              {isHe ? 'לא קורס תיאורטי.' : 'Not a theory course.'}
            </h2>
            <p className="font-sans text-xl text-black/50 max-w-2xl leading-relaxed mb-16">
              {isHe
                ? 'כל יום מתקינים סקיל חדש ב-Claude Code ויוצרים משהו אמיתי איתו. בסוף 10 ימים יש לכם 10 כלים מותקנים שעובדים — לא רק ידע.'
                : 'Each day you install a new skill in Claude Code and create something real with it. After 10 days you have 10 installed tools that work — not just knowledge.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { val: '10', labelEn: 'Video Lessons', labelHe: 'שיעורי וידאו', descEn: '20-30 min average. Practical, not lectures.', descHe: '20-30 דקות בממוצע. מעשיים, לא הרצאות.' },
                { val: '10', labelEn: 'GitHub Repos', labelHe: 'מאגרי GitHub', descEn: 'Each skill with code, guide, and install instructions.', descHe: 'כל סקיל עם קוד, מדריך והוראות התקנה.' },
                { val: '10', labelEn: 'Hebrew Guides', labelHe: 'מדריכים בעברית', descEn: 'Detailed guide per skill — API, pricing, examples.', descHe: 'מדריך מפורט לכל סקיל — API, תמחור, דוגמאות.' },
              ].map((item, i) => (
                <div key={i} className="bg-black/[0.03] border border-black/10 rounded-2xl p-8">
                  <span className="font-serif italic text-5xl text-signal-red">{item.val}</span>
                  <h3 className="font-sans font-bold text-lg mt-3 mb-1">{isHe ? item.labelHe : item.labelEn}</h3>
                  <p className="font-sans text-sm text-black/40">{isHe ? item.descHe : item.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ THE 10 SKILLS ══════ */}
        <section className="py-32 md:py-40 bg-black">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-mono text-[11px] text-signal-red tracking-wider mb-4">{isHe ? '10 סקילים' : '10 Skills'}</p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-white mb-16">
              {isHe ? 'כל יום סקיל חדש' : 'A new skill every day'}
            </h2>

            {[
              { key: 'create', labelEn: 'Create', labelHe: 'יצירה' },
              { key: 'manage', labelEn: 'Manage & Publish', labelHe: 'ניהול ופרסום' },
              { key: 'build', labelEn: 'Build & Deploy', labelHe: 'בנייה והשקה' },
            ].map((group) => (
              <div key={group.key} className="mb-12">
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">{isHe ? group.labelHe : group.labelEn}</p>
                <div className="space-y-0">
                  {SKILLS.filter(s => s.group === group.key).map((s) => (
                    <div key={s.day} className="group flex items-center gap-6 py-5 border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-lg">
                      <span className="font-mono text-sm text-signal-red font-bold w-8">{s.day}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-sans font-semibold text-lg text-white/80 group-hover:text-white transition-colors block">{isHe ? s.nameHe : s.nameEn}</span>
                        <span className="font-sans text-sm text-white/25 block mt-0.5">{isHe ? s.teaserHe : s.teaserEn}</span>
                      </div>
                      <span className="font-mono text-[10px] text-white/15 uppercase tracking-widest hidden md:block">{s.tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════ INVESTMENT ══════ */}
        <section className="py-32 md:py-40 bg-off-white text-black">
          <div className="max-w-5xl mx-auto px-6">
            <p className="font-mono text-[11px] text-signal-red tracking-wider mb-4">{isHe ? 'מה צריך' : 'What you need'}</p>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight mb-16">
              {isHe ? 'בואו נהיה ברורים לגבי העלויות' : 'Let\'s be clear about costs'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/[0.03] border border-black/10 rounded-2xl p-8">
                <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-2">{isHe ? 'מנוי Claude Code' : 'Claude Code Subscription'}</p>
                <span className="font-serif italic text-4xl text-signal-red">$100</span><span className="text-black/30 text-lg">{isHe ? '/חודש' : '/mo'}</span>
                <p className="font-sans text-sm text-black/40 mt-3 leading-relaxed">
                  {isHe
                    ? 'Max מומלץ בחום. הקורס צורך טוקנים — עם Pro ($20) אפשר אבל תגיעו למגבלות מהר.'
                    : 'Max strongly recommended. The course consumes tokens — Pro ($20) is possible but you\'ll hit limits fast.'}
                </p>
              </div>
              <div className="bg-black/[0.03] border border-black/10 rounded-2xl p-8">
                <p className="font-mono text-[10px] text-signal-red uppercase tracking-widest mb-2">{isHe ? 'שירותי API' : 'API Services'}</p>
                <span className="font-serif italic text-4xl text-signal-red">~$50</span><span className="text-black/30 text-lg"> {isHe ? 'סה"כ' : 'total'}</span>
                <p className="font-sans text-sm text-black/40 mt-3 leading-relaxed">
                  {isHe
                    ? 'תשלום לפי שימוש — יצירת תמונות, סרטונים, קול, פרסום ועוד. המטרה היא לנסות ולהבין את הערך.'
                    : 'Pay-as-you-go — images, video, voice, publishing and more. The goal is to try and understand the value.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ INSTRUCTOR ══════ */}
        <section className="py-32 md:py-40 bg-black border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12 items-start">
            <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <img src="/course/instructor.jpg" alt="Guy Aga" className="w-full h-full object-cover grayscale" />
            </div>
            <div>
              <p className="font-mono text-[11px] text-signal-red tracking-wider mb-3">{isHe ? 'מי מלמד' : 'Your instructor'}</p>
              <h2 className="font-sans font-bold text-2xl tracking-tight text-white mb-2">{isHe ? 'גיא אגא' : 'Guy Aga'}</h2>
              <p className="font-mono text-[11px] text-white/20 tracking-wider mb-6">AI Strategist · Educator · Builder</p>
              <p className="font-sans text-base text-white/40 leading-relaxed max-w-2xl">
                {isHe
                  ? 'למעלה מ-10 שנות ניסיון בבניית מוצרים דיגיטליים. מרצה במוסדות אקדמיים, עובד עם מותגים כמו Technion, Strauss ו-Maccabi. אני משתמש בסקילים האלה כל יום בעבודה שלי — הקורס הזה מלמד בדיוק את מה שאני עושה.'
                  : '10+ years building digital products. Lectures at academic institutions, works with brands like Technion, Strauss, and Maccabi. I use these skills every day — this course teaches exactly what I do.'}
              </p>
            </div>
          </div>
        </section>

        {/* ══════ FAQ ══════ */}
        <section className="py-32 md:py-40 bg-black">
          <div className="max-w-3xl mx-auto px-6">
            <p className="font-mono text-[11px] text-signal-red tracking-wider mb-4">{isHe ? 'שאלות' : 'FAQ'}</p>
            <h2 className="font-sans font-bold text-3xl tracking-tight text-white mb-12">{isHe ? 'שאלות נפוצות' : 'Frequently Asked'}</h2>
            <div>
              {FAQ_DATA.map((item, i) => (
                <div key={i} className="border-b border-white/[0.06]">
                  <button onClick={(e) => {
                    const a = e.currentTarget.nextElementSibling;
                    a.classList.toggle('max-h-0');
                    a.classList.toggle('max-h-40');
                    a.classList.toggle('opacity-0');
                    a.classList.toggle('opacity-100');
                  }} className="w-full flex items-center justify-between py-6 text-start group">
                    <span className="font-sans text-lg font-medium text-white/80 group-hover:text-signal-red transition-colors pe-4">{isHe ? item.qHe : item.qEn}</span>
                    <span className="text-white/20 text-xl shrink-0 font-light">+</span>
                  </button>
                  <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300">
                    <p className="font-sans text-base text-white/40 leading-relaxed pb-6">{isHe ? item.aHe : item.aEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ CTA ══════ */}
        <section className="py-32 md:py-40 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-signal-red/[0.03]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-signal-red/[0.04] rounded-full blur-[120px]" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-signal-red/10 border border-signal-red/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-signal-red rounded-full animate-pulse" />
              <span className="font-mono text-[11px] text-signal-red tracking-wider">{isHe ? 'הרשמה מוקדמת פתוחה' : 'Presale open'}</span>
            </span>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl tracking-tight text-white mb-6">
              {isHe ? 'מוכנים?' : 'Ready?'}
            </h2>
            <p className="font-sans text-lg text-white/30 mb-10 max-w-md mx-auto font-light">
              {isHe ? '10 ימים. 10 סקילים. כלים אמיתיים שעובדים.' : '10 days. 10 skills. Real tools that work.'}
            </p>
            <a href={LMS_URL} target="_blank" rel="noopener noreferrer"
              className="group bg-signal-red text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.03] transition-transform inline-flex items-center gap-3">
              {isHe ? 'הרשמה מוקדמת' : 'Early Access'}
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform">{isHe ? '←' : '→'}</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
