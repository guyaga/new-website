import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function ThoughtsParagraph() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.thoughts-reveal', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          invalidateOnRefresh: true,
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-off-white py-32 md:py-48"
      dir={lang === 'he' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24">
        {/* Text Content — 2/3 */}
        <div className="w-full md:w-2/3">
          <p className="thoughts-reveal font-mono text-xs text-signal-red uppercase tracking-widest mb-4">
            {t('thoughts.paragraphLabel')}
          </p>
          <h2 className="thoughts-reveal font-serif text-5xl md:text-7xl tracking-tight leading-none mb-12">
            {t('thoughts.paragraphHeading')}
          </h2>
          <p className="thoughts-reveal font-sans text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mb-8">
            {t('thoughts.paragraph1')}
          </p>
          <p className="thoughts-reveal font-sans text-lg md:text-xl text-black/50 leading-relaxed max-w-2xl">
            {t('thoughts.paragraph2')}
          </p>
        </div>

        {/* Decorative Element — 1/3, desktop only */}
        <div className="hidden md:flex w-1/3 justify-center items-start pt-16">
          <div className="w-[2px] h-64 bg-signal-red/30 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-signal-red" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-signal-red/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
