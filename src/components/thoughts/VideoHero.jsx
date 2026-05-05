import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function VideoHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const quoteRefs = useRef([]);
  const progressRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isRtl = lang === 'he';

  const quotes = [
    { text: t('thoughts.heroQuote'), author: t('thoughts.heroAttribution') },
    { text: t('thoughts.quote1'), author: t('thoughts.quote1Author') },
    { text: t('thoughts.quote2'), author: t('thoughts.quote2Author') },
    { text: t('thoughts.quote3'), author: t('thoughts.quote3Author') },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ctx = null;

    const setup = () => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;

      ctx = gsap.context(() => {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;

        // On mobile: autoplay loop (scroll-seeking unreliable on real devices)
        // On desktop: pause and scrub with scroll
        if (isDesktop) {
          video.pause();
          video.currentTime = 0;
        } else {
          video.currentTime = 0;
          video.loop = true;
          video.muted = true;
          video.play().catch(() => {});
        }

        // ──── Same pinned quote crossfade for both mobile + desktop ────
        quoteRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
        });

        const tl = gsap.timeline();

        // Desktop only: video scrub across the full timeline
        if (isDesktop) {
          const proxy = { time: 0 };
          tl.to(proxy, {
            time: dur,
            duration: 4,
            ease: 'none',
            onUpdate: () => { video.currentTime = proxy.time; },
          }, 0);
        }

        // Quote crossfades — identical on both breakpoints
        tl.to(quoteRefs.current[0], {
          opacity: 0, y: -20, duration: 0.3, ease: 'power2.inOut',
        }, 0.7)
        .fromTo(quoteRefs.current[1],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.inOut' },
        0.7)
        .to(quoteRefs.current[1], {
          opacity: 0, y: -20, duration: 0.3, ease: 'power2.inOut',
        }, 1.7)
        .fromTo(quoteRefs.current[2],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.inOut' },
        1.7)
        .to(quoteRefs.current[2], {
          opacity: 0, y: -20, duration: 0.3, ease: 'power2.inOut',
        }, 2.7)
        .fromTo(quoteRefs.current[3],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.inOut' },
        2.7);

        // Ensure timeline is long enough (desktop has video tween at dur 4)
        if (!isDesktop) {
          tl.to({}, { duration: 4 }, 0);
        }

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: true,
          animation: tl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        if (progressRef.current) {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: true,
            onUpdate: (self) => {
              gsap.set(progressRef.current, { scaleY: self.progress });
            },
          });
        }
      }, sectionRef);
    };

    if (video.readyState >= 1) {
      setup();
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true });
      video.load();
    }

    return () => {
      video.removeEventListener('loadedmetadata', setup);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-end"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/Inspire_pencil.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Progress indicator */}
      <div className="absolute right-4 md:right-8 top-[10%] bottom-[10%] w-[2px] bg-white/5 z-30">
        <div
          ref={progressRef}
          className="absolute inset-0 bg-signal-red origin-top"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      {/* Quotes — crossfade in place, same on all devices */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-32">
        <p className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-paper/60 mb-4 md:mb-6">
          {t('thoughts.heroLabel')}
        </p>
        <div className="relative min-h-[180px] md:min-h-[220px] lg:min-h-[260px]">
          {quotes.map((quote, i) => (
            <div
              key={i}
              ref={(el) => (quoteRefs.current[i] = el)}
              className="absolute inset-0 flex flex-col justify-end will-change-transform"
            >
              <blockquote className="font-serif italic text-3xl md:text-5xl lg:text-7xl leading-tight text-white tracking-tight max-w-4xl mb-3 md:mb-4">
                {quote.text}
              </blockquote>
              <p className="font-mono text-xs md:text-sm text-paper/40 tracking-wide">
                {quote.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
