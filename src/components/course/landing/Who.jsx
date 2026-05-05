import Reveal from './Reveal';
import { WHO_ITEMS } from './data';

export default function Who({ isHe }) {
  const t = isHe
    ? { eyebrow: '02 / למי זה מתאים', title: 'אתם יודעים ש-AI יכול לעזור.', titleItalic: 'פשוט לא יודעים מאיפה להתחיל.' }
    : { eyebrow: '02 / WHO THIS IS FOR', title: "You know AI can help.", titleItalic: "You just don't know where to start." };

  return (
    <section id="who" style={{
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

        <div style={{
          marginTop: 60,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 1,
          background: 'rgba(17,17,17,0.1)',
          border: '1px solid rgba(17,17,17,0.1)',
        }}>
          {WHO_ITEMS.map((it, i) => (
            <Reveal key={i} delay={120 * i}>
              <div style={{
                background: 'var(--off-white)',
                padding: '36px 30px',
                minHeight: 210,
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '0.22em', color: 'var(--signal-red)',
                  marginBottom: 16,
                }}>
                  / {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  fontSize: 22, textTransform: isHe ? 'none' : 'uppercase',
                  letterSpacing: '-0.01em', margin: 0, marginBottom: 10,
                }}>
                  {isHe ? it.tHe : it.tEn}
                </h3>
                <p style={{
                  color: 'rgba(17,17,17,0.6)', fontSize: 15,
                  lineHeight: 1.6, margin: 0,
                }}>
                  {isHe ? it.dHe : it.dEn}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
