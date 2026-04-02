import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage, createT } from '../../i18n';

export default function CourseHero() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.course-hero-el', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] bg-black text-white overflow-hidden flex items-center"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src="/course/hero.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </div>

      {/* Architectural grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundSize: '40px 40px',
        backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        {/* Label */}
        <p className="course-hero-el font-mono text-xs tracking-[0.25em] uppercase text-signal-red mb-8">
          {t('course.hero.label')}
        </p>

        {/* Title */}
        <h1 className="course-hero-el font-sans font-bold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-[0.9] mb-6">
          {t('course.hero.title').split('\n').map((line, i) => (
            <span key={i} className="block">
              {i === 0 ? line : <span className="text-signal-red">{line}</span>}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="course-hero-el font-sans text-lg md:text-xl text-white/60 max-w-xl mb-10">
          {t('course.hero.subtitle')}
        </p>

        {/* Stats row */}
        <div className="course-hero-el flex flex-wrap gap-8 mb-12">
          {[
            { value: '10', label: isHe ? 'שיעורי וידאו' : 'Video Lessons' },
            { value: '20', label: isHe ? 'דקות' : 'Minutes' },
            { value: '10', label: isHe ? 'מאגרי קוד' : 'GitHub Repos' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-serif italic text-4xl md:text-5xl text-signal-red">{stat.value}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#course-pricing"
          className="course-hero-el relative overflow-hidden group inline-flex items-center bg-signal-red text-white px-8 py-4 rounded-full font-sans font-bold text-lg transition-transform hover:scale-[1.03]"
        >
          <span className="relative z-10">{t('course.hero.cta')}</span>
          <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <span className="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {t('course.hero.cta')}
          </span>
        </a>
      </div>
    </section>
  );
}
