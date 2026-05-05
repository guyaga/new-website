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

  // Filter to only show day 1-10 (no intros)
  const courseSessions = sessions.filter((s) => s.day >= 1 && s.day <= 10);

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
        {/* Skills banner image */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-white/[0.06]">
          <img src="/course/landing-skills-banner.jpg" alt="10 Skills" className="w-full object-cover" loading="lazy" />
        </div>

        <p className="font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
          {t('course.skills.label')}
        </p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase text-white mb-12">
          {t('course.skills.heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseSessions.map((session) => (
            <SkillCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </section>
  );
}
