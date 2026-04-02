import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = ['course.learn.item1', 'course.learn.item2', 'course.learn.item3', 'course.learn.item4', 'course.learn.item5', 'course.learn.item6'];

export default function WhatYoullLearn() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.learn-item', {
        scrollTrigger: { trigger: containerRef.current, start: 'top 75%', invalidateOnRefresh: true },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-off-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: heading */}
          <div>
            <p className="learn-item font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
              {t('course.learn.label')}
            </p>
            <h2 className="learn-item font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-4">
              {t('course.learn.heading')}
            </h2>
            <div className="learn-item w-16 h-1 bg-signal-red rounded-full" />
          </div>

          {/* Right: items */}
          <div className="space-y-6">
            {ITEMS.map((key, i) => (
              <div key={key} className="learn-item flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-signal-red/10 text-signal-red font-mono text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="font-sans text-base text-black/70 pt-1">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
