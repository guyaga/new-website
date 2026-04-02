import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function CourseOverview() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.overview-el', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', invalidateOnRefresh: true },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: t('course.overview.stat1.value'), label: t('course.overview.stat1.label') },
    { value: t('course.overview.stat2.value'), label: t('course.overview.stat2.label') },
    { value: t('course.overview.stat3.value'), label: t('course.overview.stat3.label') },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-off-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="overview-el font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
          {t('course.overview.label')}
        </p>
        <h2 className="overview-el font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-6">
          {t('course.overview.heading')}
        </h2>
        <p className="overview-el font-sans text-lg text-black/60 max-w-2xl mb-12">
          {t('course.overview.desc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="overview-el bg-paper/50 rounded-xl p-8 border border-black/5">
              <span className="block font-serif italic text-5xl md:text-6xl text-signal-red mb-2">
                {stat.value}
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-black/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
