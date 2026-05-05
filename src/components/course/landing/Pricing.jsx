import Reveal from './Reveal';
import { PRICE_DATA } from './data';

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

export default function Pricing({ isHe }) {
  const t = isHe
    ? { eyebrow: '08 / המחיר', title: 'מחיר אחד.', titleItalic: 'הכל כלול.',
        stackLabel: 'מה עוד צריך',
        transparentLabel: 'תמחור שקוף',
        transparentBody: 'בערך $100/חודש + $50 חד פעמי בשירותים חיצוניים. לא חבוי.' }
    : { eyebrow: '08 / THE OFFER', title: 'One price.', titleItalic: 'Everything included.',
        stackLabel: 'WHAT YOU ALSO NEED',
        transparentLabel: 'TRANSPARENT PRICING',
        transparentBody: 'About $100/mo + $50 one-time in external services. Nothing hidden.' };

  const includes = isHe ? PRICE_DATA.includesHe : PRICE_DATA.includesEn;
  const stack = isHe ? PRICE_DATA.stackHe : PRICE_DATA.stackEn;
  const note = isHe ? PRICE_DATA.noteHe : PRICE_DATA.noteEn;
  const cta = isHe ? PRICE_DATA.ctaHe : PRICE_DATA.ctaEn;
  const guarantee = isHe ? PRICE_DATA.guaranteeHe : PRICE_DATA.guaranteeEn;

  return (
    <section id="price" style={{
      background: 'var(--off-white)',
      padding: 'clamp(80px, 12vw, 160px) 0',
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

        <div
          style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 28,
          }}
          className="price-grid"
        >
          {/* Main card */}
          <Reveal delay={150}>
            <div style={{
              background: 'var(--black)',
              color: 'var(--off-white)',
              padding: '44px 40px',
              borderRadius: 4,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 220, height: 220,
                background: 'radial-gradient(circle, rgba(230,59,46,0.25), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div className="eyebrow" style={{ color: 'var(--signal-red)' }}>COURSE · COHORT_01</div>
              <div style={{
                marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 16,
                flexWrap: 'wrap',
              }}>
                <div className="serif-ital" style={{
                  fontSize: 'clamp(4.5rem, 9vw, 7rem)',
                  color: 'var(--signal-red)',
                  lineHeight: 0.9, letterSpacing: '-0.02em',
                }}>
                  {PRICE_DATA.price}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(232,228,221,0.6)',
                }}>
                  {note}
                </div>
              </div>

              <div style={{ marginTop: 32, display: 'grid', gap: 8 }}>
                {includes.map((it, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, alignItems: 'baseline',
                    paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 15,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      color: 'var(--signal-red)', letterSpacing: '0.2em',
                      minWidth: 22,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'rgba(232,228,221,0.85)' }}>{it}</span>
                  </div>
                ))}
              </div>

              <a
                className="btn-red"
                href={LMS_URL} target="_blank" rel="noopener noreferrer"
                style={{ marginTop: 32 }}
              >
                {cta}
                <span className="arrow-wrap">{isHe ? '←' : '→'}</span>
              </a>

              <div style={{
                marginTop: 20, fontSize: 13,
                color: 'rgba(232,228,221,0.55)', lineHeight: 1.5, maxWidth: 400,
              }}>
                {guarantee}
              </div>
            </div>
          </Reveal>

          {/* Stack side */}
          <Reveal delay={250}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 18, height: '100%',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(17,17,17,0.5)', marginBottom: 4,
              }}>
                {t.stackLabel}
              </div>

              {stack.map((s, i) => (
                <div key={i} style={{
                  background: 'var(--paper)',
                  border: '1px solid rgba(17,17,17,0.08)',
                  padding: 24, borderRadius: 4,
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', gap: 16, flexWrap: 'wrap',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-sans)', fontWeight: 700,
                      fontSize: 16, textTransform: isHe ? 'none' : 'uppercase',
                    }}>
                      {s.k}
                    </div>
                    <div className="serif-ital" style={{
                      fontSize: '1.8rem', color: 'var(--signal-red)',
                    }}>
                      {s.v}
                    </div>
                  </div>
                  <div style={{
                    marginTop: 10, fontSize: 14,
                    color: 'rgba(17,17,17,0.55)', lineHeight: 1.55,
                  }}>
                    {s.n}
                  </div>
                </div>
              ))}

              <div style={{
                padding: 24, borderRadius: 4,
                background: 'var(--black)', color: 'var(--off-white)',
                flex: 1, display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <span className="pulse-dot" />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    letterSpacing: '0.22em', color: 'var(--signal-red)',
                    textTransform: 'uppercase',
                  }}>
                    {t.transparentLabel}
                  </div>
                  <div style={{
                    fontSize: 14, marginTop: 6,
                    color: 'rgba(232,228,221,0.75)', lineHeight: 1.5,
                  }}>
                    {t.transparentBody}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .price-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
