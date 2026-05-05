import Reveal from './Reveal';

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

export default function FinalCTA({ isHe }) {
  const t = isHe
    ? {
        eyebrow: 'הרשמה מוקדמת פתוחה',
        title: 'בעוד עשרה ימים,',
        titleItalic: 'יהיו לכם עשרה דברים שבניתם.',
        cta: 'להרשמה המוקדמת',
        price: '₪1,199 — המחיר עולה בהשקה',
      }
    : {
        eyebrow: 'PRESALE OPEN',
        title: 'Ten days from now,',
        titleItalic: "you'll have built ten things.",
        cta: 'Join the presale',
        price: '₪1,199 — price rises at launch',
      };

  return (
    <section id="final" style={{
      background: 'var(--black)',
      color: 'var(--off-white)',
      padding: 'clamp(100px, 14vw, 200px) 0',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="grid-dark" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900, height: 900,
        background: 'radial-gradient(circle, rgba(230,59,46,0.18), transparent 60%)',
        pointerEvents: 'none', filter: 'blur(20px)',
      }} />

      <div className="bundle-container" style={{ position: 'relative', textAlign: 'center' }}>
        <Reveal>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 14px',
            border: '1px solid rgba(230,59,46,0.4)',
            background: 'rgba(230,59,46,0.08)',
            borderRadius: 999,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--signal-red)',
          }}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            {t.eyebrow}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2.2rem, 6vw, 6rem)',
            marginTop: 30, color: 'var(--off-white)',
            maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto',
          }}>
            {t.title}
            <br />
            <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>
              {t.titleItalic}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={250}>
          <div style={{ marginTop: 50, display: 'flex', justifyContent: 'center' }}>
            <a
              className="btn-red"
              href={LMS_URL} target="_blank" rel="noopener noreferrer"
              style={{ padding: '22px 40px', fontSize: 18 }}
            >
              {t.cta}
              <span className="arrow-wrap">{isHe ? '←' : '→'}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div style={{
            marginTop: 24,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(232,228,221,0.55)',
          }}>
            {t.price}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
