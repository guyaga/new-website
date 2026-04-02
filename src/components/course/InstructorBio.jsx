import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function InstructorBio() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.instructor-el', {
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

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-black text-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="instructor-el relative">
            <div className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <img
                src="/course/instructor.jpg"
                alt="Guy Aga"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            {/* Decorative */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-signal-red/20 rounded-full" />
          </div>

          {/* Bio */}
          <div>
            <p className="instructor-el font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
              {t('course.instructor.label')}
            </p>
            <h2 className="instructor-el font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-2">
              {t('course.instructor.heading')}
            </h2>
            <p className="instructor-el font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
              {t('course.instructor.role')}
            </p>
            <p className="instructor-el font-sans text-base text-white/60 leading-relaxed mb-8">
              {t('course.instructor.bio')}
            </p>

            {/* Stats */}
            <div className="instructor-el flex flex-wrap gap-8">
              {[
                { value: '10+', label: isHe ? 'שנות ניסיון' : 'Years Experience' },
                { value: '7', label: isHe ? 'לקוחות מובילים' : 'Top Clients' },
                { value: '1000+', label: isHe ? 'סטודנטים' : 'Students' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="block font-serif italic text-2xl text-signal-red">{stat.value}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
