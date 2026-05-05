import Reveal from './Reveal';
import { GET_CARDS } from './data';

export default function WhatYouGet({ isHe }) {
  const t = isHe
    ? { eyebrow: '04 / מה מקבלים', title: 'לא קורס תיאורטי.', titleItalic: 'ארגז כלים עובד.',
        sub: 'עשרה ימים. עשרה סקילים מותקנים. עשרה רפוזיטוריז שממשיכים לעבוד אחרי הקורס.' }
    : { eyebrow: '04 / WHAT YOU GET', title: 'Not a theory course.', titleItalic: 'A working toolkit.',
        sub: 'Ten days. Ten installed skills. Ten repos that keep working after the course ends.' };

  return (
    <section id="get" style={{
      background: 'var(--paper)', color: 'var(--black)',
      padding: 'clamp(80px, 12vw, 160px) 0', position: 'relative',
    }}>
      <div className="bundle-container">
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>
        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)', marginTop: 20, maxWidth: 900,
          }}>
            {t.title}{' '}
            <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>{t.titleItalic}</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p style={{
            marginTop: 20, maxWidth: 600,
            color: 'rgba(17,17,17,0.65)', fontSize: '1.1rem', lineHeight: 1.6,
          }}>
            {t.sub}
          </p>
        </Reveal>

        <div style={{
          marginTop: 60,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {GET_CARDS.map((c, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{
                background: 'var(--off-white)',
                border: '1px solid rgba(17,17,17,0.08)',
                padding: 28, borderRadius: 4,
                minHeight: 240,
                display: 'flex', flexDirection: 'column',
              }}>
                <div className="serif-ital" style={{
                  fontSize: '5rem', color: 'var(--signal-red)', lineHeight: 0.9,
                }}>
                  {c.n}
                </div>
                <div style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  textTransform: isHe ? 'none' : 'uppercase', fontSize: 15,
                  letterSpacing: '-0.01em', marginTop: 14,
                }}>
                  {isHe ? c.tHe : c.tEn}
                </div>
                <div style={{
                  marginTop: 10, fontSize: 14,
                  color: 'rgba(17,17,17,0.55)', lineHeight: 1.55,
                }}>
                  {isHe ? c.dHe : c.dEn}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
