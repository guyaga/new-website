import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';
import SkillCard from './SkillCard';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsGrid({ sessions }) {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-card', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', invalidateOnRefresh: true },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-black" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
          {t('course.skills.label')}
        </p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase text-white mb-12">
          {t('course.skills.heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SkillCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}
