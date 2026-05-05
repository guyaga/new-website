import { useState, useEffect, useRef } from 'react';
import Reveal from './Reveal';

function Terminal({ lines }) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const containerRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        let i = 0;
        const type = () => {
          if (i < lines.length) {
            setText(lines.slice(0, i + 1));
            i++;
            const ch = lines[i - 1];
            const delay = ch === '\n' ? 110 : Math.random() * 30 + 14;
            setTimeout(type, delay);
          }
        };
        type();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [lines]);

  useEffect(() => {
    const t = setInterval(() => setIdx((x) => (x + 1) % 10), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        color: '#e8e4dd',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px', background: '#141414',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: 11, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'rgba(232,228,221,0.5)',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }} />
        <span style={{ marginLeft: 12 }}>claude-code — {String(idx + 1).padStart(2, '0')}/10</span>
        <span style={{ marginInlineStart: 'auto', color: 'var(--signal-red)' }} dir="ltr">● LIVE</span>
      </div>
      <div style={{ padding: '22px 22px 26px', minHeight: 320 }}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }} dir="ltr">
          {text.split('\n').map((line, i) => {
            const isPrompt = line.startsWith('$');
            const isOk = line.startsWith('[✓]');
            const isComment = line.startsWith('>');
            return (
              <div key={i} style={{
                color: isPrompt ? 'var(--signal-red)'
                  : isOk ? '#7AE582'
                  : isComment ? 'rgba(232,228,221,0.55)'
                  : '#E8E4DD',
              }}>
                {line}
              </div>
            );
          })}
          <span className="term-caret" />
        </div>
      </div>
    </div>
  );
}

export default function Demo({ isHe }) {
  const demoCode = isHe
    ? `$ claude skill install images\n> מתקין skill: image-generation\n[✓] Gemini 3 Pro מחובר\n\n$ claude skill run images\n> "הדגמת מוצר נקייה של\n   ארנק עור על נייר בז׳"\n[✓] 01.png נוצר ב-4.2 שניות`
    : `$ claude skill install images\n> installing: image-generation\n[✓] Gemini 3 Pro wired\n\n$ claude skill run images\n> "a clean product shot of a\n   leather wallet on cream paper"\n[✓] 01.png generated in 4.2s`;

  const t = isHe
    ? {
        eyebrow: '01 / יום בקורס',
        title: 'סקיל מותקן', titleItalic: 'בזמן אמת.',
        sub: 'כל יום מתקינים סקיל חדש ב-Claude Code ובונים איתו משהו אמיתי. בלי תיאוריה. בלי מילוי. עשרים דקות, כלי עובד אחד.',
        caption: 'יום 01 — סקיל יצירת תמונות',
      }
    : {
        eyebrow: '01 / A DAY INSIDE THE COURSE',
        title: 'Watch a skill install in', titleItalic: 'real-time.',
        sub: 'Each day, you install a Claude Code skill on your machine and use it to build something. No theory. No fluff. Twenty minutes, one working tool.',
        caption: 'Day 01 — Image Generation skill',
      };

  return (
    <section id="demo" style={{
      background: 'var(--black)',
      color: 'var(--off-white)',
      position: 'relative',
      padding: 'clamp(80px, 12vw, 160px) 0',
      overflow: 'hidden',
    }}>
      <div className="grid-dark" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div className="bundle-container" style={{ position: 'relative' }}>
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>

        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
            marginTop: 20, color: 'var(--off-white)',
          }}>
            {t.title}{' '}
            <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>{t.titleItalic}</span>
          </h2>
        </Reveal>

        <div
          style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: 48,
            alignItems: 'start',
          }}
          className="demo-grid"
        >
          <Reveal delay={200}>
            <Terminal lines={demoCode} />
            <div style={{
              marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(232,228,221,0.45)',
            }}>
              {t.caption}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p style={{
              fontSize: 'clamp(1.1rem, 1.4vw, 1.3rem)',
              lineHeight: 1.6,
              color: 'rgba(232,228,221,0.7)',
              maxWidth: 520,
            }}>
              {t.sub}
            </p>

            <div style={{
              marginTop: 40, padding: 24,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -10, insetInlineStart: 20,
                background: 'var(--black)', padding: '0 10px',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'var(--signal-red)',
              }}>
                SPEC / 01
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
                fontFamily: 'var(--font-mono)', fontSize: 12,
              }}>
                {[
                  { k: isHe ? 'קלט' : 'INPUT', v: isHe ? 'טקסט' : 'plain text' },
                  { k: isHe ? 'פלט' : 'OUTPUT', v: isHe ? 'קובץ עובד' : 'working file' },
                  { k: isHe ? 'זמן' : 'TIME', v: isHe ? '20 דקות' : '20 min' },
                  { k: 'CODE', v: '0 lines', red: true },
                ].map((row, i) => (
                  <div key={i}>
                    <div style={{
                      color: 'rgba(232,228,221,0.45)', fontSize: 10,
                      letterSpacing: '0.2em', marginBottom: 6,
                    }}>
                      {row.k}
                    </div>
                    <div style={{ color: row.red ? 'var(--signal-red)' : undefined }}>{row.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
