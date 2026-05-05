import { useState, useEffect } from 'react';
import { useLanguage } from '../../../i18n';

const LMS_URL = 'https://my.schooler.biz/s/112677/Claudecodeskills';

export default function FloatingNav({ isHe }) {
  const [onDark, setOnDark] = useState(false);
  const { setLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOnDark(y > window.innerHeight * 0.85 && y < document.body.scrollHeight - window.innerHeight * 1.4);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const labels = isHe
    ? { skills: 'סקילים', demo: 'הדגמה', about: 'מי מלמד', faq: 'שאלות', cta: 'הרשמה מוקדמת' }
    : { skills: 'Skills', demo: 'Demo', about: 'About', faq: 'FAQ', cta: 'Join presale' };

  return (
    <nav className={`floating-nav ${onDark ? 'on-dark' : ''}`}>
      <span className="nav-brand">10/10</span>
      <button className="nav-link" onClick={() => go('skills')}>{labels.skills}</button>
      <button className="nav-link" onClick={() => go('demo')}>{labels.demo}</button>
      <button className="nav-link" onClick={() => go('about')}>{labels.about}</button>
      <button className="nav-link" onClick={() => go('faq')}>{labels.faq}</button>
      <button
        className="nav-link"
        onClick={() => setLang(isHe ? 'en' : 'he')}
        style={{ opacity: 0.6 }}
      >
        {isHe ? 'EN' : 'עב'}
      </button>
      <a className="nav-cta" href={LMS_URL} target="_blank" rel="noopener noreferrer">
        {labels.cta}
      </a>
    </nav>
  );
}
