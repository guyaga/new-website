import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollQuotes() {
  const containerRef = useRef(null);
  const quoteRefs = useRef([]);
  const progressRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);

  const quotes = [
    { text: t('thoughts.quote1'), author: t('thoughts.quote1Author') },
    { text: t('thoughts.quote2'), author: t('thoughts.quote2Author') },
    { text: t('thoughts.quote3'), author: t('thoughts.quote3Author') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = ScrollTrigger.matchMedia({
        // Desktop: pinned timeline
        '(min-width: 768px)': () => {
          // Set initial state — all quotes hidden
          quoteRefs.current.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 60 });
          });

          const tl = gsap.timeline();

          // Quote 1: fade in → hold → fade out
          tl.to(quoteRefs.current[0], { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
            .to({}, { duration: 0.5 })
            .to(quoteRefs.current[0], { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' })
            // Quote 2: fade in → hold → fade out
            .to(quoteRefs.current[1], { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
            .to({}, { duration: 0.5 })
            .to(quoteRefs.current[1], { opacity: 0, y: -40, duration: 0.8, ease: 'power2.in' })
            // Quote 3: fade in → hold (stays visible)
            .to(quoteRefs.current[2], { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
            .to({}, { duration: 0.5 });

          ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1,
            animation: tl,
            invalidateOnRefresh: true,
          });

          // Progress indicator
          if (progressRef.current) {
            gsap.fromTo(
              progressRef.current,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: 'top top',
                  end: '+=300%',
                  scrub: true,
                },
              }
            );
          }
        },

        // Mobile: simple scroll-triggered stagger
        '(max-width: 767px)': () => {
          quoteRefs.current.forEach((el) => {
            gsap.from(el, {
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                invalidateOnRefresh: true,
              },
              y: 40,
              opacity: 0,
              duration: 1,
              ease: 'power3.out',
            });
          });
        },
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-black min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Progress indicator — desktop only */}
      <div className="hidden md:block absolute right-8 top-[10%] bottom-[10%] w-[2px] bg-paper/10 z-10">
        <div
          ref={progressRef}
          className="absolute inset-0 bg-signal-red origin-top"
        />
      </div>

      <div
        className="relative w-full max-w-7xl mx-auto px-6 md:px-12"
        dir={lang === 'he' ? 'rtl' : 'ltr'}
      >
        {/* Desktop: stacked absolute quotes */}
        <div className="hidden md:block relative min-h-[60vh]">
          {quotes.map((quote, i) => (
            <div
              key={i}
              ref={(el) => (quoteRefs.current[i] = el)}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <blockquote className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight max-w-4xl">
                {quote.text}
              </blockquote>
              <p className="font-mono text-xs md:text-sm text-paper/40 tracking-wide mt-8">
                {quote.author}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: stacked vertical quotes */}
        <div className="md:hidden flex flex-col gap-24 py-24">
          {quotes.map((quote, i) => (
            <div
              key={i}
              ref={(el) => (quoteRefs.current[i] = el)}
            >
              <blockquote className="font-serif italic text-3xl text-white leading-tight tracking-tight">
                {quote.text}
              </blockquote>
              <p className="font-mono text-xs text-paper/40 tracking-wide mt-6">
                {quote.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
