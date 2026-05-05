export default function LandingFooter({ isHe }) {
  const t = isHe
    ? { left: 'אסטרטגיית AI · מוצרים דיגיטליים · הדרכה', rights: '© 2026 גיא אגא · BESTGUY.AI' }
    : { left: 'AI STRATEGY · DIGITAL PRODUCTS · EDUCATION', rights: '© 2026 GUY AGA · BESTGUY.AI' };

  return (
    <footer style={{
      background: 'var(--black)',
      color: 'var(--off-white)',
      padding: '40px 0',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="bundle-container" style={{
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(232,228,221,0.5)',
        }}>
          {t.left}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--signal-red)',
        }}>
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          SYSTEM OPERATIONAL_
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', color: 'rgba(232,228,221,0.3)',
        }}>
          {t.rights}
        </div>
      </div>
    </footer>
  );
}
