import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

const COURSE_URL = 'https://my.schooler.biz/s/113939/1691505442920-6';

const ROLES = [
  'יוצר/ת תוכן',
  'צלם/ת',
  'מעצב/ת גרפי/ת',
  'מעצב/ת פנים',
  'מנהל/ת שיווק',
  'מורה',
  'אדריכל/ית',
  'איש/ת שיווק דיגיטלי',
  'אחר',
];

const CATEGORIES = [
  { code: '01', title: 'תמונות AI', desc: 'יצירה, עריכה, אאוטפוטים מקצועיים — מ-Midjourney ועד Nano Banano.', tools: 'MIDJOURNEY · DALL·E · NANO BANANO', img: '/bigbomb/cat-image.jpg', big: true },
  { code: '02', title: 'וידאו AI', desc: 'מהפכת הוידאו — Runway, Kling, Veo, Sora.', tools: 'RUNWAY · KLING · VEO · SORA', img: '/bigbomb/cat-video.jpg' },
  { code: '03', title: 'Vibe Coding', desc: 'אפליקציות, דפי נחיתה ואוטומציות עם AI.', tools: 'CURSOR · REPLIT · BOLT', img: '/bigbomb/cat-code.jpg' },
  { code: '04', title: '3D AI', desc: 'מודלים תלת-ממדיים, רינדורים, סצנות — בקליק.', tools: 'MESHY · LUMA · TRIPO', img: '/bigbomb/cat-3d.jpg' },
  { code: '05', title: 'סאונד', desc: 'אפקטים, מוזיקה, ג׳ינגלים — נוצרים בטקסט.', tools: 'ELEVENLABS · SUNO · UDIO', img: '/bigbomb/cat-sound.jpg' },
  { code: '06', title: 'אווטארים', desc: 'דמויות מדברות, מצגות, סרטוני הסבר.', tools: 'HEYGEN · SYNTHESIA · D-ID', img: '/bigbomb/cat-avatars.jpg' },
  { code: '07', title: 'אנימציה ועריכה', desc: 'הנפשה, עריכה אוטומטית, מעברים חלקים.', tools: 'CAPCUT · DESCRIPT · PIKA', img: '/bigbomb/cat-animation.jpg' },
  { code: '08', title: 'פרומפטינג מתקדם', desc: 'איך לדבר עם מודלים ולקבל תוצאות באיכות אחרת.', tools: 'CHATGPT · CLAUDE · GEMINI', img: '/bigbomb/cat-prompting.jpg' },
];

const AUDIENCE = [
  'יוצרי תוכן',
  'צלמים',
  'מעצבים גרפיים',
  'מעצבי פנים',
  'מנהלי שיווק',
  'מורים',
  'אדריכלים',
  'אנשי שיווק דיגיטלי',
];

const TICKER = ['IMAGE', 'VIDEO', '3D', 'SOUND', 'CODE', 'PROMPTING', 'AVATARS', 'MUSIC', 'ANIMATION', 'DESIGN'];

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.1);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 800ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform 800ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

function MagneticButton({ children, href, onClick, type, disabled, className = '', style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled]);
  const baseStyle = { ...style, transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform' };
  if (href) {
    return <a ref={ref} href={href} onClick={onClick} className={className} style={baseStyle}>{children}</a>;
  }
  return <button ref={ref} type={type || 'button'} onClick={onClick} disabled={disabled} className={className} style={baseStyle}>{children}</button>;
}

export default function TheBigBomb() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '', consent: false });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('bigbomb_signup') === 'done') {
      setStatus('success');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const cleanName = formData.name.trim();
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPhone = formData.phone.trim() || null;
      const cleanRole = formData.role || null;

      const { error } = await supabase.from('free_course_signups').insert({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: cleanRole,
        marketing_consent: formData.consent,
      });

      const isDuplicate = error && error.code === '23505';
      if (error && !isDuplicate) {
        setStatus('error');
        setErrorMsg('משהו השתבש. נסו שוב או שלחו לי אימייל ל-Guy@aga.digital');
        return;
      }

      // Reveal link immediately — emails fire-and-forget after
      localStorage.setItem('bigbomb_signup', 'done');
      setStatus('success');

      // Skip emails on duplicate so we don't spam returning users
      if (!isDuplicate) {
        supabase.functions
          .invoke('send-bigbomb-email', {
            body: { name: cleanName, email: cleanEmail, phone: cleanPhone, role: cleanRole },
          })
          .catch((err) => console.warn('email dispatch failed:', err));
      }
    } catch {
      setStatus('error');
      setErrorMsg('משהו השתבש. נסו שוב או שלחו לי אימייל ל-Guy@aga.digital');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(COURSE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* no-op */ }
  };

  const consentValid = formData.consent && formData.name && formData.email;

  return (
    <>
      <Helmet>
        <title>קורס Gen-AI חינם · כל כלי ה-AI במקום אחד | גיא אגא</title>
        <meta name="description" content="קורס Gen-AI מקיף — תמונות, וידאו, vibe coding, 3D, סאונד, אווטארים, פרומפטינג. שמונה תחומים. כל הכלים העדכניים ביותר. מעודכן עד מרץ 2026. חינם." />
        <meta property="og:title" content="קורס Gen-AI חינם · גיא אגא" />
        <meta property="og:description" content="כל כלי ה-AI שצריך לדעת ב-2026, במקום אחד. מעודכן · מרץ 2026. חינם." />
        <meta property="og:image" content="/bigbomb/cover.jpg" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1080" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/bigbomb/cover.jpg" />
      </Helmet>

      <main dir="rtl" className="bg-off-white text-black font-sans relative overflow-x-hidden">
        {/* HERO — full-bleed video background, text overlaid */}
        <section className="relative w-full overflow-hidden border-b border-black/10" style={{ minHeight: '100dvh' }}>
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/bigbomb/hero-key.jpg"
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/bigbomb/hero-loop.mp4" type="video/mp4" />
          </video>

          {/* Dark gradient overlay for text legibility — taste: tinted to bg, no neon */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.9) 100%)',
          }} />

          {/* Top tape */}
          <div className="absolute top-0 inset-x-0 h-[4px] bg-signal-red z-30" />

          {/* Top meta row */}
          <div className="absolute top-[22px] inset-x-0 z-30 px-6 md:px-10 flex justify-between items-center font-mono text-[10px] tracking-[0.22em] uppercase text-off-white/65">
            <div className="flex items-center gap-2.5">
              <span className="pulse-dot" />
              <span>SYSTEM_OPERATIONAL</span>
            </div>
            <div>GEN_AI / FREE_COURSE</div>
          </div>

          {/* Hero content — anchored bottom-right (RTL: bottom-right reads first), brand typography */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-28 md:pb-32 flex flex-col justify-end" style={{ minHeight: '100dvh' }}>
            <div className="max-w-2xl">
              <Reveal delay={50}>
                <div className="flex flex-wrap items-center gap-2 mb-7">
                  <div
                    className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.22em] uppercase w-fit"
                    style={{ border: '1px solid rgba(230,59,46,0.5)', background: 'rgba(230,59,46,0.12)', color: 'var(--signal-red)' }}
                  >
                    <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                    קורס Gen-AI · חינם
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] tracking-[0.22em] uppercase text-off-white/80" style={{ border: '1px solid rgba(245,243,238,0.18)', background: 'rgba(0,0,0,0.35)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--off-white)', opacity: 0.7 }} />
                    מעודכן · מרץ 2026
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <h1 className="m-0 mb-7" style={{ display: 'flex', flexDirection: 'column', gap: 'min(1vw, 6px)' }}>
                  <span className="font-sans font-bold leading-[0.95] tracking-[-0.02em]" style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', color: 'var(--off-white)', textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
                    כל כלי ה-AI
                  </span>
                  <span className="serif-ital leading-[0.95]" style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', color: 'var(--signal-red)', letterSpacing: '-0.02em', textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>
                    במקום אחד.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={280}>
                <p className="text-off-white/85 leading-[1.6] mb-9 max-w-md text-base md:text-lg" style={{ textShadow: '0 1px 20px rgba(0,0,0,0.6)' }}>
                  שמונה תחומים. כל הכלים העדכניים ביותר ב-2026 — מהכפתור הראשון ועד דוגמאות מהעולם האמיתי.
                </p>
              </Reveal>

              <Reveal delay={380}>
                <div className="flex flex-wrap items-center gap-5">
                  <MagneticButton
                    href="#signup"
                    className="bg-signal-red text-white px-9 py-4 rounded-full font-sans font-semibold text-base hover:bg-white hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      קבלו את הקורס
                      <span style={{ display: 'inline-block', transform: 'translateY(-1px)' }}>←</span>
                    </span>
                  </MagneticButton>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-off-white/65 leading-[1.7]">
                    גישה מיידית<br />
                    ללא תשלום
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Bottom-left tagline */}
          <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 z-20 hidden md:flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-off-white/55">
            <span className="pulse-dot" style={{ width: 5, height: 5, background: 'var(--signal-red)' }} />
            <span>ENERGY · LOOP_5S</span>
          </div>
        </section>

        {/* MARQUEE STRIP between hero and bento — slim, brand */}
        <div className="bg-off-white border-b border-black/10 py-3 overflow-hidden">
          <div className="bundle-marquee">
            {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((w, i) => (
              <span key={i} className="font-mono text-[11px] tracking-[0.22em] uppercase inline-flex items-center" style={{ color: i % 3 === 0 ? 'var(--signal-red)' : 'var(--black)', gap: 60 }}>
                {w} <span className="opacity-30">×</span>
              </span>
            ))}
          </div>
        </div>

        {/* WHAT'S INSIDE — bento gallery on light architectural bg */}
        <section className="py-24 md:py-32 px-6 md:px-10 architectural-grid border-b border-black/10">
          <div className="max-w-[1400px] mx-auto">
            <Reveal>
              <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-6">
                01 / מה יש בקורס
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-6 mb-14">
              <Reveal delay={80} className="md:col-span-7">
                <h2 className="font-sans font-bold leading-[0.95] tracking-[-0.02em]" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', color: 'var(--black)' }}>
                  שמונה תחומים. <span className="serif-ital text-signal-red font-normal">כל אחד עולם.</span>
                </h2>
              </Reveal>
              <Reveal delay={150} className="md:col-span-5">
                <p className="text-black/55 leading-[1.6] text-base md:text-lg">
                  מהכפתור הראשון ועד דוגמאות שימוש מעשיות. סקירה מלאה של כל הכלים, על כל הקטגוריות.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {CATEGORIES.map((cat) => (
                <CategoryTile key={cat.code} cat={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* WHY IT'S FREE — manifesto bridge */}
        <section className="py-24 md:py-36 px-6 md:px-10 bg-off-white border-b border-black/10">
          <div className="max-w-[1100px] mx-auto text-center">
            <Reveal>
              <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-8">
                למה זה חינם?
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="serif-ital leading-[1.1] mb-10 mx-auto" style={{ fontSize: 'clamp(2rem, 4.6vw, 4.2rem)', letterSpacing: '-0.02em', maxWidth: '900px' }}>
                כי תוכן AI צריך להיות <span className="text-signal-red">חופשי וזמין</span> — לכל מי שרוצה ללמוד.
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mx-auto text-black/65 leading-[1.7] text-lg md:text-xl mb-12" style={{ maxWidth: '640px' }}>
                הקורס הזה הוא הבסיס. כל הכלים, כל הקטגוריות, ידע פרקטי שכולם זקוקים לו ב-2026.
                בלי תשלום. בלי תנאים.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mx-auto pt-10 border-t border-black/10" style={{ maxWidth: '720px' }}>
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-black/45 mb-4">
                  השלב הבא
                </div>
                <p className="serif-ital text-black/85 leading-[1.4] mb-6" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.1rem)', letterSpacing: '-0.01em' }}>
                  מי שמחפש לקחת את זה צעד קדימה — לחבר את כל הכלים האלה יחד דרך
                  <span className="text-signal-red"> כלים אג&apos;נטיים</span>, מתוך מקום אחד — מוזמן להשקיע בקורס המשך.
                </p>
                <a
                  href="#bonus-card"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('a[href="/course/preview"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-signal-red hover:text-black transition-colors"
                >
                  <span>10 ימים. 10 סקילים.</span>
                  <span style={{ display: 'inline-block' }}>↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHO IT'S FOR — paper bg, asymmetric */}
        <section className="py-24 md:py-32 px-6 md:px-10 bg-paper/40 border-b border-black/10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-6">
                  02 / קהל יעד
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="serif-ital leading-[0.95] mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', letterSpacing: '-0.02em' }}>
                  למי זה מתאים?
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-black/60 leading-[1.6] text-lg max-w-md">
                  לכל מי שרוצה ליישר קו עם התעשייה והכלים העדכניים ביותר. לא צריך רקע טכני — צריך רק סקרנות.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal delay={120}>
                <div className="flex flex-wrap gap-2.5">
                  {AUDIENCE.map((a) => (
                    <span
                      key={a}
                      className="px-5 py-2.5 rounded-full border border-black/15 bg-off-white text-black font-mono text-[11px] tracking-[0.18em] uppercase"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-12 pt-8 border-t border-black/10">
                  <p className="serif-ital text-2xl md:text-3xl text-black/80 leading-[1.3] max-w-xl">
                    אם אתם רוצים ליישר קו עם התעשייה — <span className="text-signal-red">זה בשבילכם.</span>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ABOUT GUY — split editorial with portrait + 10D10S callout */}
        <section className="py-24 md:py-32 px-6 md:px-10 architectural-grid border-b border-black/10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-stretch">
            <div className="md:col-span-5">
              <Reveal>
                <div className="relative aspect-[4/5] overflow-hidden bg-paper" style={{ borderRadius: '1.5rem', border: '1px solid rgba(17,17,17,0.1)' }}>
                  <img
                    src="/course/instructor.jpg"
                    alt="גיא אגא"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-0 inset-x-0 p-5 md:p-7 flex items-start justify-between">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-black/55 bg-off-white/80 backdrop-blur-sm px-2 py-1 rounded">
                      גיא אגא
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-black/55 bg-off-white/80 backdrop-blur-sm px-2 py-1 rounded">
                      <span className="pulse-dot" style={{ width: 5, height: 5, background: 'var(--signal-red)' }} />
                      ב-2026
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <Reveal>
                  <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-6">
                    03 / מי מאחורי הקורס
                  </div>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="font-sans font-bold leading-[0.92] tracking-[-0.02em] mb-5" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)' }}>
                    גיא אגא.
                  </h2>
                </Reveal>
                <Reveal delay={150}>
                  <h3 className="serif-ital leading-[1.05] mb-10 text-signal-red" style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)', letterSpacing: '-0.02em' }}>
                    שלוש וחצי שנים בתוך עולמות ה-AI.
                  </h3>
                </Reveal>

                <Reveal delay={230}>
                  <div className="space-y-4 text-black/70 leading-[1.7] text-base md:text-lg max-w-2xl">
                    <p>
                      שחקן ותיק בעולמות השיווק הדיגיטלי. ניהל נוכחות עבור כמה מהמותגים הגדולים בישראל
                      ובנה אסטרטגיה דיגיטלית עבור עשרות מותגים.
                    </p>
                    <p>
                      מאמין בשיטת <span className="font-mono text-sm tracking-[0.15em] text-signal-red">HANDS_ON</span>.
                      מרצה באקדמיה, דובר בכנסים, ורושם רשימה ארוכה של שידורי לייב שכבשו את הרשת.
                    </p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={350}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 mt-10" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                  {[
                    { num: '3.5+', label: 'שנים ב-AI' },
                    { num: '40+', label: 'מותגים' },
                    { num: 'LIVE', label: 'אקדמיה · כנסים' },
                    { num: 'HANDS', label: 'ON_ שיטה' },
                  ].map((s) => (
                    <div key={s.label} className="bg-off-white p-5 md:p-6">
                      <div className="font-sans font-bold text-3xl md:text-4xl text-black mb-1.5" style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
                        {s.num}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/50">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* 10 Days 10 Skills callout — full-width below split */}
          <div className="max-w-[1400px] mx-auto mt-14 md:mt-20">
            <Reveal>
              <a
                href="/course/preview"
                className="group relative block bg-black text-off-white overflow-hidden"
                style={{ borderRadius: '1.5rem' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
                  {/* Left: text */}
                  <div className="md:col-span-8 p-7 md:p-10 lg:p-12">
                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal-red mb-4">
                      השלב הבא
                    </div>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-sans font-bold leading-none" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', color: 'var(--off-white)', letterSpacing: '-0.02em' }}>
                        10 ימים.
                      </span>
                      <span className="serif-ital leading-none text-signal-red" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', letterSpacing: '-0.02em' }}>
                        10 סקילים.
                      </span>
                    </div>
                    <p className="text-paper/70 leading-[1.6] mb-7 max-w-xl text-base md:text-lg">
                      קורס Claude Code פרימיום — סקיל ביום, 20 דקות בשיעור. בונים דברים אמיתיים, לא טוטוריאלים.
                      אם המתנה הזו פתחה לכם את התיאבון, זה הצעד הבא.
                    </p>
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="inline-flex items-center gap-3 bg-signal-red text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm group-hover:bg-white group-hover:text-black transition-colors">
                        לעמוד הקורס
                        <span style={{ display: 'inline-block', transform: 'translateY(-1px)' }}>←</span>
                      </div>
                      <div className="font-serif text-2xl md:text-3xl italic text-paper/90" style={{ letterSpacing: '-0.01em' }}>
                        ₪1,199
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">
                        מחיר מוקדם
                      </div>
                    </div>
                  </div>

                  {/* Right: 10 visual marker */}
                  <div className="md:col-span-4 relative overflow-hidden border-t md:border-t-0 md:border-r border-white/10" style={{ minHeight: '180px' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="serif-ital text-signal-red leading-none select-none"
                        style={{
                          fontSize: 'clamp(7rem, 18vw, 16rem)',
                          letterSpacing: '-0.06em',
                          opacity: 0.95,
                          textShadow: '0 4px 60px rgba(230,59,46,0.25)',
                        }}
                      >
                        10
                      </span>
                    </div>
                    <div className="absolute top-0 inset-x-0 p-5 md:p-7 flex items-start justify-between">
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">DAYS</span>
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">SKILLS</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-5 md:p-7 flex items-end justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">
                      <span>CLAUDE CODE</span>
                      <span className="text-signal-red">PREMIUM</span>
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        {/* SIGNUP FORM — dark, centered focus mode */}
        <section id="signup" className="bg-black text-off-white py-24 md:py-32 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            {status === 'success' ? (
              <SuccessState courseUrl={COURSE_URL} onCopy={copyLink} copied={copied} />
            ) : (
              <>
                <Reveal>
                  <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-6">
                    04 / קבלת הקורס
                  </div>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="font-sans font-bold leading-[0.95] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
                    הירשמו וקבלו <span className="serif-ital text-signal-red font-normal">גישה מיידית.</span>
                  </h2>
                </Reveal>
                <Reveal delay={150}>
                  <p className="text-paper/55 text-lg mb-12 max-w-xl leading-[1.6]">
                    הקישור יופיע מיד לאחר ההרשמה. בלי המתנה. בלי ספאם.
                  </p>
                </Reveal>

                <Reveal delay={220}>
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <Field label="שם מלא" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="הקלידו את השם המלא" />
                      <Field label="אימייל" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" ltr />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <Field label="טלפון (אופציונלי)" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="050-1234567" ltr optional />
                      <SelectField label="תפקיד / עיסוק (אופציונלי)" name="role" value={formData.role} onChange={handleChange} options={ROLES} optional />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer pt-2">
                      <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mt-1 w-4 h-4 accent-signal-red flex-shrink-0" />
                      <span className="text-sm text-paper/70 leading-[1.6]">
                        אני מסכים/ה לקבל מסרים שיווקיים מגיא אגא ו-BestGuy.AI על כלי AI חדשים, קורסים ועדכונים. ניתן להסיר את עצמכם בכל עת.
                        <span className="text-paper/35"> (נדרש לפי חוק הספאם)</span>
                      </span>
                    </label>

                    {status === 'error' && (
                      <p className="font-mono text-sm text-signal-red">{errorMsg}</p>
                    )}

                    <div className="pt-4">
                      <MagneticButton
                        type="submit"
                        disabled={status === 'sending' || !consentValid}
                        className="bg-signal-red text-white px-10 py-4 rounded-full font-sans font-semibold text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          {status === 'sending' ? 'שולח...' : 'קבלו את הקורס'}
                          <span style={{ display: 'inline-block' }}>←</span>
                        </span>
                      </MagneticButton>
                      {!consentValid && status !== 'sending' && (
                        <p className="mt-4 font-mono text-[10px] tracking-[0.18em] uppercase text-paper/35">
                          שם · אימייל · הסכמה — נדרשים כדי להמשיך
                        </p>
                      )}
                    </div>
                  </form>
                </Reveal>
              </>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 px-6 md:px-10 bg-off-white border-t border-black/10">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.18em] uppercase text-black/45">
            <div>BESTGUY.AI · גיא אגא · 2026</div>
            <a href="/" className="hover:text-signal-red transition-colors">חזרה לאתר ←</a>
          </div>
        </footer>
      </main>
    </>
  );
}

function CategoryTile({ cat }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.15);

  if (cat.typo) {
    return (
      <div
        ref={ref}
        className={`group relative overflow-hidden bg-black flex flex-col justify-between p-6 md:p-8 transition-all duration-700 ${cat.big ? 'col-span-2 row-span-2' : ''}`}
        style={{
          borderRadius: '1.25rem',
          aspectRatio: cat.big ? '2/2' : '1/1',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
        }}
      >
        <div className="flex items-start justify-between">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal-red">{cat.code}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.4)" strokeWidth="1.4" className="transition-transform duration-300 group-hover:translate-x-[-3px] group-hover:-translate-y-[3px]">
            <path d="M17 7L7 17M17 7H9M17 7V15" />
          </svg>
        </div>
        <div>
          <h3 className="font-sans font-bold text-off-white mb-3" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.4rem)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {cat.title}
          </h3>
          <p className="text-paper/55 text-sm leading-[1.5] mb-4 max-w-xs">
            {cat.desc}
          </p>
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/40">
            {cat.tools}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden transition-all duration-700 ${cat.big ? 'col-span-2 row-span-2' : ''}`}
      style={{
        borderRadius: '1.25rem',
        aspectRatio: cat.big ? '2/2' : '1/1',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        background: '#111',
        border: '1px solid rgba(17,17,17,0.08)',
      }}
    >
      <img
        src={cat.img}
        alt={cat.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ filter: 'saturate(0.95) contrast(1.04)' }}
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.85) 100%)',
      }} />

      <div className="absolute top-0 inset-x-0 p-5 md:p-6 flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal-red">{cat.code}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(245,243,238,0.7)" strokeWidth="1.4" className="transition-transform duration-300 group-hover:translate-x-[-3px] group-hover:-translate-y-[3px]">
          <path d="M17 7L7 17M17 7H9M17 7V15" />
        </svg>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5 md:p-7">
        <h3 className="font-sans font-bold text-off-white mb-2" style={{
          fontSize: cat.big ? 'clamp(2rem, 3.6vw, 3.8rem)' : 'clamp(1.4rem, 2.2vw, 2.2rem)',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          textShadow: '0 2px 30px rgba(0,0,0,0.6)',
        }}>
          {cat.title}
        </h3>
        <p className="text-off-white/75 text-sm leading-[1.5] mb-3 max-w-md" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}>
          {cat.desc}
        </p>
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-off-white/60">
          {cat.tools}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, value, onChange, placeholder, ltr, optional }) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] tracking-[0.22em] uppercase text-paper/40 mb-2.5">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={!optional}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={ltr ? 'ltr' : undefined}
        style={ltr ? { textAlign: 'right' } : undefined}
        className="w-full bg-transparent border-b border-white/15 focus:border-signal-red py-3 font-sans text-off-white text-base outline-none transition-colors placeholder:text-white/20"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, optional }) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] tracking-[0.22em] uppercase text-paper/40 mb-2.5">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={!optional}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-white/15 focus:border-signal-red py-3 font-sans text-off-white text-base outline-none transition-colors appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1L6 6L11 1' stroke='%23F5F3EE' stroke-opacity='0.4' stroke-width='1.4'/></svg>")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left 4px center',
          paddingLeft: '24px',
        }}
      >
        <option value="" className="bg-black text-off-white">בחרו תפקיד</option>
        {options.map((r) => (
          <option key={r} value={r} className="bg-black text-off-white">{r}</option>
        ))}
      </select>
    </div>
  );
}

function SuccessState({ courseUrl, onCopy, copied }) {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none overflow-visible">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute top-8 left-1/2"
            style={{
              width: 6,
              height: 14,
              background: i % 3 === 0 ? 'var(--signal-red)' : i % 3 === 1 ? 'var(--paper)' : 'var(--off-white)',
              transformOrigin: 'center',
              animation: `confetti-burst-${i} 1400ms cubic-bezier(0.2,0.8,0.3,1) forwards`,
              opacity: 0,
            }}
          />
        ))}
        <style>{[...Array(14)].map((_, i) => {
          const angle = (i / 14) * 360;
          const dist = 90 + (i % 3) * 50;
          const x = Math.cos((angle - 90) * Math.PI / 180) * dist;
          const y = Math.sin((angle - 90) * Math.PI / 180) * dist;
          return `@keyframes confetti-burst-${i} {
            0% { opacity: 0; transform: translate(-50%, 0) rotate(0deg); }
            15% { opacity: 1; }
            100% { opacity: 0; transform: translate(calc(-50% + ${x}px), ${y + 60}px) rotate(${(i * 47) % 360}deg); }
          }`;
        }).join('\n')}</style>
      </div>

      <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-signal-red mb-8 mt-4">
        ACCESS_GRANTED
      </div>

      <h2 className="font-sans font-bold leading-[0.92] tracking-[-0.02em] mb-6" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
        <span className="serif-ital text-signal-red font-normal">קיבלתם.</span>
      </h2>

      <p className="text-paper/65 text-lg mb-12 max-w-xl leading-[1.6]">
        הנה הקישור לקורס. שמרו אותו, תיהנו, תלמדו. ואם משהו עוזר — אשמח אם תספרו לי במייל.
      </p>

      <div className="bg-paper text-black p-7 md:p-9 mb-6" style={{ borderRadius: '1.5rem' }}>
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-black/40 mb-3">
          הקישור שלכם
        </div>
        <div className="font-mono text-sm md:text-base text-black break-all mb-6 select-all" dir="ltr">
          {courseUrl}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-signal-red text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:bg-black transition-colors"
          >
            פתחו את הקורס בכרטיסייה חדשה ←
          </a>
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-2 border border-black/20 text-black px-7 py-3.5 rounded-full font-mono text-[11px] tracking-[0.18em] uppercase hover:border-black hover:bg-black hover:text-paper transition-colors"
          >
            {copied ? 'הועתק' : 'העתק קישור'}
          </button>
        </div>
      </div>

      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-paper/35">
        שמרתם את הקישור — אפשר לחזור לדף הזה בכל עת ולהגיע אליו שוב.
      </div>
    </div>
  );
}
