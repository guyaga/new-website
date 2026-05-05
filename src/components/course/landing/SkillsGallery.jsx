import { useState, useEffect, useRef } from 'react';
import Reveal from './Reveal';
import { SKILLS, SKILL_CODES, SKILL_GROUPS } from './data';

function SkillSlab({ s, isHe, active }) {
  const group = SKILL_GROUPS[s.day];
  const code = SKILL_CODES[s.day];
  return (
    <div
      className="skill-slab"
      style={{
        background: active ? 'linear-gradient(135deg, #1a1a1a 0%, #111 60%)' : 'var(--black)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? '0 0 80px rgba(230,59,46,0.12)' : 'none',
        transition: 'box-shadow 500ms, background 500ms, transform 500ms, opacity 500ms',
        transform: active ? 'scale(1)' : 'scale(0.97)',
        opacity: active ? 1 : 0.7,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', color: 'var(--signal-red)',
            textTransform: 'uppercase',
          }}>
            {isHe ? 'יום' : 'DAY'}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(4.5rem, 9vw, 9rem)',
            lineHeight: 0.85, color: 'var(--off-white)',
            letterSpacing: '-0.02em',
          }}>
            {s.day}
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(232,228,221,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '6px 12px', borderRadius: 999,
        }}>
          {group}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginTop: 16,
      }}>
        <div>
          <h3 className="caps-head" style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2.4rem)',
            color: 'var(--off-white)', marginBottom: 14,
          }}>
            {isHe ? s.nameHe : s.nameEn}
          </h3>
          <p style={{
            color: 'rgba(232,228,221,0.65)',
            fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
            lineHeight: 1.55, maxWidth: 420, margin: 0,
          }}>
            {isHe ? s.promiseHe : s.promiseEn}
          </p>
          <div style={{
            marginTop: 20,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(232,228,221,0.5)',
          }}>
            {isHe ? 'כלי' : 'TOOL'} · <span style={{ color: 'var(--signal-red)' }}>{s.tool}</span>
          </div>
        </div>

        <div
          dir="ltr"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6,
            padding: 18,
            fontFamily: 'var(--font-mono)', fontSize: 12,
            lineHeight: 1.7, whiteSpace: 'pre-wrap',
            color: 'rgba(232,228,221,0.8)',
          }}
        >
          {code.split('\n').map((line, j) => (
            <div key={j} style={{
              color: line.startsWith('$') ? 'var(--signal-red)'
                : line.startsWith('[✓]') ? '#7AE582'
                : line.startsWith('>') ? 'rgba(232,228,221,0.55)'
                : 'rgba(232,228,221,0.8)',
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 18, paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(232,228,221,0.35)',
      }}>
        <span>{isHe ? 'פלט מוכן' : 'OUTPUT READY'}</span>
        <span style={{ color: 'rgba(232,228,221,0.6)' }}>20 MIN · {s.day}/10</span>
      </div>
    </div>
  );
}

function arrowStyle(disabled) {
  return {
    width: 48, height: 48, borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'transparent', color: 'var(--off-white)',
    fontSize: 18, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    transition: 'background 200ms, transform 200ms',
    fontFamily: 'var(--font-mono)',
  };
}

export default function SkillsGallery({ isHe }) {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollToIdx = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(SKILLS.length - 1, i));
    const child = track.children[clamped];
    if (!child) return;
    const left = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
    setActiveIdx(clamped);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestDist = Infinity;
        for (let i = 0; i < track.children.length; i++) {
          const c = track.children[i];
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - center);
          if (d < bestDist) { bestDist = d; best = i; }
        }
        setActiveIdx(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll
  const pausedRef = useRef(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = (track.children[0]?.clientWidth || 500) + 20;
        track.scrollBy({ left: isHe ? -step : step, behavior: 'smooth' });
      }
    }, 3500);
    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume, { passive: true });
    return () => {
      clearInterval(timer);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', resume);
    };
  }, [isHe]);

  // Drag-to-scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown = false, startX = 0, startScroll = 0;
    const onDown = (e) => {
      isDown = true;
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      startScroll = track.scrollLeft;
      track.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!isDown) return;
      const x = e.touches ? e.touches[0].pageX : e.pageX;
      track.scrollLeft = startScroll - (x - startX);
    };
    const onUp = () => { isDown = false; track.style.cursor = 'grab'; };
    track.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      track.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const arrow = (dir) => () => scrollToIdx(activeIdx + (isHe ? -dir : dir));

  const safeIdx = Math.max(0, Math.min(activeIdx, SKILLS.length - 1));
  const currentSkill = SKILLS[safeIdx];

  const t = isHe
    ? { eyebrow: '03 / העשרה', title: 'סקיל אחד.', titleItalic: 'בכל יום.', scrollLabel: 'גרור או גלול' }
    : { eyebrow: '03 / THE TEN', title: 'One skill.', titleItalic: 'Every day.', scrollLabel: 'DRAG OR SCROLL' };

  return (
    <section id="skills" style={{
      background: 'var(--black)',
      color: 'var(--off-white)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(80px, 12vw, 140px) 0 clamp(60px, 9vw, 110px)',
    }}>
      <div className="grid-dark" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

      <div className="bundle-container" style={{ position: 'relative' }}>
        <Reveal><div className="eyebrow">{t.eyebrow}</div></Reveal>
        <Reveal delay={100}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            flexWrap: 'wrap', gap: 24, marginTop: 20,
          }}>
            <h2 className="caps-head" style={{
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              color: 'var(--off-white)', margin: 0,
            }}>
              {t.title}{' '}
              <span className="serif-ital" style={{ color: 'var(--signal-red)' }}>{t.titleItalic}</span>
            </h2>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={arrow(-1)} aria-label="prev" style={arrowStyle(activeIdx === 0)}>
                {isHe ? '→' : '←'}
              </button>
              <button onClick={arrow(1)} aria-label="next" style={arrowStyle(activeIdx === SKILLS.length - 1)}>
                {isHe ? '←' : '→'}
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`#skills .skills-track::-webkit-scrollbar { display: none; }`}</style>
      <div
        ref={trackRef}
        className="skills-track"
        style={{
          marginTop: 50,
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          cursor: 'grab',
          paddingInline: 'max(28px, calc((100vw - 1280px) / 2 + 28px))',
          gap: 20,
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        {SKILLS.map((s, i) => (
          <div key={s.day} style={{ scrollSnapAlign: 'center', flex: '0 0 auto' }}>
            <SkillSlab s={s} isHe={isHe} active={i === activeIdx} />
          </div>
        ))}
      </div>

      <div className="bundle-container" style={{
        marginTop: 30,
        display: 'flex', alignItems: 'center', gap: 18,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(232,228,221,0.6)', flexWrap: 'wrap',
      }}>
        <span className="pulse-dot" />
        <span>{String(safeIdx + 1).padStart(2, '0')} / 10</span>
        <div style={{
          flex: 1, minWidth: 120, maxWidth: 400,
          height: 2, background: 'rgba(255,255,255,0.12)', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, insetInlineStart: 0, height: '100%',
            width: `${((safeIdx + 1) / SKILLS.length) * 100}%`,
            background: 'var(--signal-red)', transition: 'width 300ms',
          }} />
        </div>
        <span style={{ color: 'var(--signal-red)' }}>{SKILL_GROUPS[currentSkill.day]}</span>
        <span style={{ opacity: 0.5 }}>{t.scrollLabel}</span>
      </div>
    </section>
  );
}
