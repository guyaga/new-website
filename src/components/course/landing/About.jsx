import Reveal from './Reveal';

const CLIENTS = ['Technion', 'Strauss', 'Maccabi', 'IBI', 'AIG'];

export default function About({ isHe }) {
  const t = isHe
    ? {
        eyebrow: '05 / מי מלמד',
        name: 'גיא אגא',
        role: 'אסטרטג AI · מחנך · בונה · תל אביב',
        bio: 'מעל עשור של בנייה של מוצרים דיגיטליים. מרצה במוסדות אקדמיים. עובד עם טכניון, שטראוס, מכבי, IBI, AIG. כל מה שבקורס — זה מה שאני עושה כל יום בעבודה.',
        quote: 'אני לא מלמד אתכם מה AI יכול לעשות.',
        quote2: 'אני מלמד אתכם מה אני עושה איתו.',
      }
    : {
        eyebrow: '05 / WHO TEACHES',
        name: 'Guy Aga',
        role: 'AI Strategist · Educator · Builder · Tel Aviv',
        bio: 'Ten-plus years building digital products. Lectures at academic institutions. Works with Technion, Strauss, Maccabi, IBI, AIG. Everything in this course is what I actually use every day.',
        quote: "I'm not teaching you what AI might do.",
        quote2: "I'm teaching you what I already do with it.",
      };

  return (
    <section id="about" style={{
      background: 'var(--off-white)',
      padding: 'clamp(80px, 12vw, 160px) 0',
    }}>
      <div className="bundle-container">
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>

        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 60,
            alignItems: 'start',
          }}
          className="about-grid"
        >
          <Reveal delay={100}>
            <div style={{
              width: '100%', aspectRatio: '4/5',
              background: 'var(--black)',
              borderRadius: 4, overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(17,17,17,0.1)',
            }}>
              <img
                src="/course/instructor.jpg"
                alt={isHe ? 'גיא אגא' : 'Guy Aga'}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  filter: 'grayscale(0.25) contrast(1.05)',
                  display: 'block',
                }}
              />
              {/* Signal-red corner tick */}
              <div style={{
                position: 'absolute', top: 0, insetInlineStart: 0,
                width: 28, height: 2, background: 'var(--signal-red)',
              }} />
              <div style={{
                position: 'absolute', top: 0, insetInlineStart: 0,
                width: 2, height: 28, background: 'var(--signal-red)',
              }} />
              {/* Mono label */}
              <div style={{
                position: 'absolute', top: 14, insetInlineStart: 18,
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.22em', color: 'var(--off-white)',
                mixBlendMode: 'difference',
              }}>
                GUY AGA / 01
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h2 className="caps-head" style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            }}>
              {t.name}
            </h2>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.22em', color: 'var(--signal-red)',
              textTransform: 'uppercase', marginTop: 12,
            }}>
              {t.role}
            </div>

            <p style={{
              marginTop: 26, maxWidth: 600,
              fontSize: '1.1rem', lineHeight: 1.65, color: 'rgba(17,17,17,0.7)',
            }}>
              {t.bio}
            </p>

            <div style={{
              marginTop: 40,
              paddingInlineStart: 24,
              borderInlineStart: '2px solid var(--signal-red)',
            }}>
              <div className="serif-ital" style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', lineHeight: 1.25,
                color: 'var(--black)',
              }}>
                "{t.quote}
                <br />
                {t.quote2}"
              </div>
            </div>

            <div style={{
              marginTop: 40,
              display: 'flex', flexWrap: 'wrap', gap: 8,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>
              {CLIENTS.map((n, i) => (
                <span key={i} style={{
                  padding: '6px 12px',
                  border: '1px solid rgba(17,17,17,0.15)',
                  borderRadius: 999,
                  color: 'rgba(17,17,17,0.55)',
                }}>
                  {n}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .about-grid > *:first-child { max-width: 240px; }
        }
      `}</style>
    </section>
  );
}
