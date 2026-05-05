import { useState } from 'react';
import Reveal from './Reveal';
import { FAQ_ITEMS } from './data';

export default function FAQ({ isHe }) {
  const [open, setOpen] = useState(0);

  const t = isHe
    ? { eyebrow: '09 / שאלות', title: 'שאלות', titleItalic: 'ותשובות.' }
    : { eyebrow: '09 / FAQ', title: 'Questions,', titleItalic: 'answered.' };

  return (
    <section id="faq" style={{
      background: 'var(--paper)',
      padding: 'clamp(80px, 12vw, 160px) 0',
    }}>
      <div className="bundle-container" style={{ maxWidth: 860 }}>
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>
        <Reveal delay={100}>
          <h2 className="caps-head" style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)', marginTop: 20,
          }}>
            {t.title}{' '}
            <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>{t.titleItalic}</span>
          </h2>
        </Reveal>

        <div style={{ marginTop: 50 }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <div className="faq-q">
                <span>{isHe ? item.qHe : item.qEn}</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-a">{isHe ? item.aHe : item.aEn}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
