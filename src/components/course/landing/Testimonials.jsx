import Reveal from './Reveal';
import { TESTIMONIALS } from './data';

export default function Testimonials({ isHe }) {
  const t = isHe
    ? { eyebrow: '07 / חתימות', title: 'הסימן המוקדם.' }
    : { eyebrow: '07 / RECEIVED', title: 'Early signal.' };

  return (
    <section id="testim" style={{
      background: 'var(--black)',
      color: 'var(--off-white)',
      padding: 'clamp(80px, 12vw, 160px) 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="grid-dark" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
      <div className="bundle-container" style={{ position: 'relative' }}>
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>
        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)', marginTop: 20,
            color: 'var(--off-white)',
          }}>
            {t.title}
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div style={{
            marginTop: 50,
            display: 'flex', alignItems: 'baseline', gap: 28,
            paddingBottom: 30, borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div className="serif-ital" style={{
              fontSize: 'clamp(6rem, 12vw, 12rem)',
              color: 'var(--signal-red)', lineHeight: 0.9, letterSpacing: '-0.02em',
            }}>
              {TESTIMONIALS.count}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 13,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(232,228,221,0.6)', maxWidth: 320,
            }}>
              {isHe ? TESTIMONIALS.countLabelHe : TESTIMONIALS.countLabelEn}
            </div>
          </div>
        </Reveal>

        <div style={{
          marginTop: 60,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {TESTIMONIALS.quotes.map((q, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 28, borderRadius: 4, minHeight: 260,
                display: 'flex', flexDirection: 'column',
              }}>
                <div className="serif-ital" style={{
                  fontSize: '2.5rem', color: 'var(--signal-red)',
                  lineHeight: 1, marginBottom: 10,
                }}>"</div>
                <p style={{
                  fontSize: '1.05rem', lineHeight: 1.55,
                  color: 'rgba(232,228,221,0.85)', flex: 1, margin: 0,
                }}>
                  {isHe ? q.qHe : q.qEn}
                </p>
                <div style={{
                  marginTop: 20, paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{isHe ? q.byHe : q.byEn}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '0.22em', color: 'rgba(232,228,221,0.5)',
                    textTransform: 'uppercase', marginTop: 4,
                  }}>
                    {isHe ? q.roleHe : q.roleEn}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
