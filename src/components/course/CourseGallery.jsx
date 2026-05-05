import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function CourseGallery() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-el', {
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
    <section ref={containerRef} className="py-24 md:py-40 bg-off-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="gallery-el font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
          {isHe ? 'מה תיצרו' : 'What You\'ll Create'}
        </p>
        <h2 className="gallery-el font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-12">
          {isHe ? 'תוצרים אמיתיים' : 'Real Outputs'}
        </h2>

        <div className="gallery-el rounded-2xl overflow-hidden border border-black/10 shadow-sm">
          <img
            src="/course/landing-gallery-1.jpg"
            alt={isHe ? 'דוגמאות ליצירות מהקורס — פוסט לסושיאל, מוקאפ מוצר, אתר נחיתה, מצגת' : 'Course output examples — social post, product mockup, landing page, presentation'}
            className="w-full object-cover"
            loading="lazy"
          />
        </div>

        <p className="gallery-el font-sans text-base text-black/40 mt-6 max-w-2xl text-center mx-auto">
          {isHe
            ? 'פוסטים לסושיאל, מוקאפים, אתרי נחיתה, מצגות, סרטונים ועוד — הכל נוצר עם Claude Code ומיומנויות הקורס.'
            : 'Social posts, mockups, landing pages, presentations, videos and more — all created with Claude Code and the course skills.'}
        </p>
      </div>
    </section>
  );
}
