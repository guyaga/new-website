import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  'course.pricing.feature1',
  'course.pricing.feature2',
  'course.pricing.feature3',
  'course.pricing.feature4',
  'course.pricing.feature5',
];

export default function Pricing({ lmsUrl }) {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-el', {
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
    <section id="course-pricing" ref={containerRef} className="py-24 md:py-40 bg-off-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="pricing-el font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
            {t('course.pricing.label')}
          </p>
          <h2 className="pricing-el font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase">
            {t('course.pricing.heading')}
          </h2>
        </div>

        {/* Pricing card */}
        <div className="pricing-el max-w-lg mx-auto bg-black text-white rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-8 md:p-10">
            <h3 className="font-sans font-bold text-2xl mb-6">
              {t('course.pricing.name')}
            </h3>

            <ul className="space-y-4 mb-8">
              {FEATURES.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <Check size={16} className="shrink-0 text-signal-red mt-0.5" />
                  <span className="font-sans text-sm text-white/70">{t(key)}</span>
                </li>
              ))}
            </ul>

            <a
              href={lmsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden group flex items-center justify-center w-full bg-signal-red text-white py-4 rounded-full font-sans font-bold text-lg transition-transform hover:scale-[1.02]"
            >
              <span className="relative z-10">{t('course.pricing.cta')}</span>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {t('course.pricing.cta')}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
