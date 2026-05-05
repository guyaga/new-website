import Reveal from './Reveal';
import { ROLE_LABELS_EN, ROLE_LABELS_HE } from './data';

export default function Community({ isHe }) {
  const labels = isHe ? ROLE_LABELS_HE : ROLE_LABELS_EN;

  const t = isHe
    ? {
        eyebrow: '06 / הקהילה',
        title: 'קבוצת וואטסאפ.',
        titleItalic: 'סגורה. פעילה.',
        lede: 'הקהילה שלנו חיה בוואטסאפ וסגורה לחברי הקורס בלבד. זה לא שרת עם 10,000 חברים שותקים — זו קבוצה קטנה, אקטיבית, של אנשים שמתקינים סקילים כמוכם, משתפים ניצחונות, ושואלים שאלות ממשיות. אני שם כל יום, יחד איתם.',
        benefitsHead: 'למה זה חשוב',
        benefits: [
          { t: 'רק לחברי הקורס', d: 'הגישה מגיעה אוטומטית כשנרשמים. אין חברים אקראיים.' },
          { t: 'תמיכה מאנשים שעושים את זה', d: 'השאלות שלכם מקבלות תשובות ממי שכבר עבר את השיעור.' },
          { t: 'גיא בפנים יומיומי', d: 'אני נוכח בקבוצה, עונה, מפשט ודוחף להעלות פרויקטים לאוויר.' },
          { t: 'הרבה אחרי הקורס', d: 'הקבוצה ממשיכה — סקילים מתעדכנים, מודלים חדשים, טיפים מהשטח.' },
        ],
        honest: 'לא ספאם. לא אירועי נטוורקינג. רק עבודה אמיתית ואנשים שעוזרים אחד לשני להוציא דברים לדרך.',
      }
    : {
        eyebrow: '06 / COMMUNITY',
        title: 'A WhatsApp group.',
        titleItalic: 'Members only. Active.',
        lede: "Our community lives on WhatsApp and it's closed to course members only. It isn't a 10,000-member server with silent lurkers — it's a small, active group of people installing these skills alongside you, sharing wins, and asking real questions. I'm in it every day.",
        benefitsHead: 'WHY IT MATTERS',
        benefits: [
          { t: 'Members-only access', d: 'Your invite arrives when you enroll. No random outsiders in the room.' },
          { t: 'Peers doing the work', d: 'Your questions get answered by people already shipping with these skills.' },
          { t: 'I am in it, daily', d: "I'm active in the group — answering, unblocking, and pushing you to ship your work." },
          { t: 'Long after the course', d: 'The group keeps going — skill updates, new models, tips from real-world use.' },
        ],
        honest: 'No spam. No networking events. Just real work and real people helping each other ship.',
      };

  return (
    <section id="community" style={{
      background: 'var(--off-white)',
      padding: 'clamp(80px, 12vw, 160px) 0',
    }}>
      <div className="bundle-container">
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>

        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', marginTop: 20, maxWidth: 1000,
          }}>
            {t.title}{' '}
            <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>{t.titleItalic}</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p style={{
            marginTop: 28, maxWidth: 720,
            fontSize: '1.125rem', lineHeight: 1.65, color: 'rgba(17,17,17,0.7)',
          }}>
            {t.lede}
          </p>
        </Reveal>

        {/* Role marquee — subtle texture */}
        <Reveal delay={200}>
          <div style={{
            marginTop: 56, padding: '18px 0',
            borderTop: '1px solid rgba(17,17,17,0.12)',
            borderBottom: '1px solid rgba(17,17,17,0.12)',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: 80,
              background: 'linear-gradient(to right, var(--off-white), transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: 80,
              background: 'linear-gradient(to left, var(--off-white), transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div className="bundle-marquee" style={{ whiteSpace: 'nowrap', width: 'max-content' }}>
              {[...labels, ...labels, ...labels].map((l, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: i % 3 === 0 ? 'var(--signal-red)' : 'rgba(17,17,17,0.55)',
                  display: 'inline-flex', alignItems: 'center', gap: 60,
                }}>
                  {l}<span style={{ opacity: 0.3 }}>·</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Benefits — 4 tiles */}
        <Reveal delay={250}>
          <div style={{
            marginTop: 48,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', color: 'rgba(17,17,17,0.5)',
            textTransform: 'uppercase',
          }}>
            {t.benefitsHead}
          </div>
        </Reveal>

        <div style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 1,
          background: 'rgba(17,17,17,0.1)',
          border: '1px solid rgba(17,17,17,0.1)',
        }}>
          {t.benefits.map((b, i) => (
            <Reveal key={i} delay={300 + i * 80}>
              <div style={{
                background: 'var(--off-white)',
                padding: '32px 28px', minHeight: 190,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.22em', color: 'var(--signal-red)',
                  marginBottom: 14,
                }}>
                  / {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: 18, textTransform: isHe ? 'none' : 'uppercase',
                  letterSpacing: '-0.01em', margin: 0, marginBottom: 10,
                }}>
                  {b.t}
                </h3>
                <p style={{
                  color: 'rgba(17,17,17,0.62)', fontSize: 14.5,
                  lineHeight: 1.55, margin: 0,
                }}>
                  {b.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={450}>
          <p className="serif-ital" style={{
            marginTop: 40, maxWidth: 640,
            fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
            lineHeight: 1.35, color: 'var(--black)',
          }}>
            "{t.honest}"
          </p>
        </Reveal>
      </div>
    </section>
  );
}
