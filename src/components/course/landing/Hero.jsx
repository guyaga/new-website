import { useState, useEffect, useRef } from 'react';
import Reveal from './Reveal';
import { TICKER_EN, TICKER_HE } from './data';

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

export default function Hero({ isHe }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const px = mouse.x * 14;
  const py = mouse.y * 14;

  const t = isHe
    ? { eyebrow: 'הרשמה מוקדמת · המחזור יוצא בקרוב', tagline: 'אסטרטג דיגיטל · מלמד AI · יוצר מוצרים',
        lead1: '10', lead2: 'ימים.', tail1: '10', tail2: 'סקילים.',
        sub: 'ללמוד לעבוד עם Claude Code. סקיל ביום, 20 דקות בשיעור. בונים דברים אמיתיים — לא טוטוריאלים.',
        cta: 'להרשמה המוקדמת', price: '₪1,199', priceNote: 'מחיר מוקדם. עולה בהשקה.',
        metaTop: 'SYSTEM OPERATIONAL_', metaBottom: 'v10.0 / COHORT_01',
      }
    : { eyebrow: 'Presale · Cohort launches soon', tagline: 'DIGITAL STRATEGIST · AI EDUCATOR · PRODUCT CREATOR',
        lead1: 'TEN', lead2: 'DAYS.', tail1: 'TEN', tail2: 'skills.',
        sub: 'Master Claude Code — one skill per day, 20 minutes per lesson. Build real things, not tutorials.',
        cta: 'Join the presale', price: '₪1,199', priceNote: 'Early-bird. Price increases at launch.',
        metaTop: 'SYSTEM OPERATIONAL_', metaBottom: 'v10.0 / COHORT_01',
      };

  const ticker = isHe ? TICKER_HE : TICKER_EN;

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--off-white)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--black)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <div className="grid-light" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Red tape top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 6,
        background: 'var(--signal-red)', zIndex: 5,
      }} />

      {/* Top meta row */}
      <div className="bundle-container" style={{
        position: 'absolute', top: 30, left: 0, right: 0, zIndex: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'rgba(17,17,17,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="pulse-dot" />
          <span>{t.metaTop}</span>
        </div>
        <div>{t.metaBottom}</div>
      </div>

      {/* BIG 10 backdrop */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: isHe ? 'auto' : '-4%',
        right: isHe ? '-4%' : 'auto',
        transform: `translateY(-50%) translate(${px}px, ${py}px)`,
        zIndex: 1,
        color: 'rgba(17,17,17,0.055)',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: 'clamp(22rem, 58vw, 60rem)',
        lineHeight: 0.78,
        letterSpacing: '-0.06em',
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        10
      </div>

      {/* Spinning 10-point ring */}
      <svg
        className="spin-ring"
        width="340" height="340" viewBox="0 0 340 340"
        style={{
          position: 'absolute',
          top: '18%',
          right: isHe ? 'auto' : '8%',
          left: isHe ? '8%' : 'auto',
          zIndex: 2,
          opacity: 0.95,
          transform: `translate(${-px * 0.4}px, ${-py * 0.4}px)`,
        }}
      >
        <circle cx="170" cy="170" r="168" fill="none" stroke="var(--signal-red)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="170" cy="170" r="140" fill="none" stroke="rgba(17,17,17,0.18)" strokeWidth="1" />
        <circle cx="170" cy="170" r="110" fill="none" stroke="rgba(17,17,17,0.1)" strokeWidth="1" />
        {[...Array(10)].map((_, i) => {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={i}>
              <line
                x1={170 + Math.cos(a) * 155} y1={170 + Math.sin(a) * 155}
                x2={170 + Math.cos(a) * 168} y2={170 + Math.sin(a) * 168}
                stroke="var(--black)" strokeWidth="1"
              />
              <text
                x={170 + Math.cos(a) * 128} y={170 + Math.sin(a) * 128}
                textAnchor="middle" dominantBaseline="middle"
                fontFamily="var(--font-mono)" fontSize="10" fontWeight="700"
                fill={i === 0 ? 'var(--signal-red)' : 'var(--black)'}
                transform={`rotate(${(i / 10) * 360} ${170 + Math.cos(a) * 128} ${170 + Math.sin(a) * 128})`}
              >
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}
        <circle cx="170" cy="170" r="5" fill="var(--signal-red)" />
      </svg>

      {/* Main content */}
      <div className="bundle-container" style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 120, paddingBottom: 80, flex: 1,
      }}>
        <Reveal delay={100}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 14px',
            border: '1px solid rgba(230,59,46,0.3)',
            background: 'rgba(230,59,46,0.06)',
            borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--signal-red)',
            width: 'fit-content',
            marginBottom: 28,
          }}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            {t.eyebrow}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <h1 style={{
            margin: 0, display: 'flex', flexDirection: 'column',
            gap: 'min(2vw, 14px)',
          }}>
            <span className="caps-head" style={{
              fontSize: 'clamp(3.2rem, 9vw, 9rem)', color: 'var(--black)',
            }}>
              {t.lead1}{' '}
              <span className="serif-ital" style={{ color: 'var(--signal-red)', fontSize: '1.08em' }}>
                {t.lead2}
              </span>
            </span>
            <span className="caps-head" style={{
              fontSize: 'clamp(3.2rem, 9vw, 9rem)', color: 'var(--black)', opacity: 0.35,
            }}>
              {t.tail1}{' '}
              <span className="serif-ital" style={{ color: 'var(--black)', opacity: 1, fontSize: '1.08em' }}>
                {t.tail2}
              </span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <p style={{
            maxWidth: 560, marginTop: 28,
            fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
            lineHeight: 1.55,
            color: 'rgba(17,17,17,0.65)',
          }}>
            {t.sub}
          </p>
        </Reveal>

        <Reveal delay={500}>
          <div style={{
            marginTop: 40, display: 'flex', alignItems: 'center',
            flexWrap: 'wrap', gap: 22,
          }}>
            <a className="btn-red" href={LMS_URL} target="_blank" rel="noopener noreferrer">
              {t.cta}
              <span className="arrow-wrap">{isHe ? '←' : '→'}</span>
            </a>
            <div>
              <div style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: '2.2rem', color: 'var(--black)', lineHeight: 1,
              }}>
                {t.price}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10,
                textTransform: 'uppercase', letterSpacing: '0.22em',
                color: 'rgba(17,17,17,0.5)', marginTop: 6,
              }}>
                {t.priceNote}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={700}>
          <div style={{
            marginTop: 60, display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.45)',
          }}>
            <span style={{ width: 40, height: 1, background: 'var(--signal-red)' }} />
            {t.tagline}
          </div>
        </Reveal>
      </div>

      {/* Bottom ticker */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
        padding: '18px 0',
        borderTop: '1px solid rgba(17,17,17,0.12)',
        background: 'var(--off-white)',
        overflow: 'hidden',
      }}>
        <div className="bundle-marquee">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((w, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: i % 3 === 0 ? 'var(--signal-red)' : 'var(--black)',
              display: 'inline-flex', alignItems: 'center', gap: 60,
            }}>
              {w} <span style={{ opacity: 0.3 }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
