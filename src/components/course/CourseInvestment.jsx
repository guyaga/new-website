import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function CourseInvestment() {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.invest-el', {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image */}
          <div className="invest-el rounded-2xl overflow-hidden border border-white/[0.06]">
            <img src="/course/landing-investment.jpg" alt="Course Investment" className="w-full object-cover" loading="lazy" />
          </div>

          {/* Right: details */}
          <div>
            <p className="invest-el font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
              {isHe ? 'מה צריך' : 'What You Need'}
            </p>
            <h2 className="invest-el font-sans font-bold text-3xl md:text-4xl tracking-tight mb-8">
              {isHe ? 'ההשקעה שלכם' : 'Your Investment'}
            </h2>

            {/* Claude subscription */}
            <div className="invest-el bg-white/[0.04] border border-white/10 rounded-xl p-6 mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-sans font-bold text-xl">Claude Code Max</h3>
                <span className="font-serif italic text-3xl text-signal-red">$100<span className="text-base text-white/30">/mo</span></span>
              </div>
              <p className="font-sans text-sm text-white/40 leading-relaxed">
                {isHe
                  ? 'מנוי מומלץ בחום. הקורס צורך טוקנים — עם Pro ($20) אפשר אבל תגיעו למגבלות מהר. Max נותן פי 5 יותר שימוש ומאפשר לתרגל בנוחות.'
                  : 'Strongly recommended. This course consumes tokens — Pro ($20) is possible but you\'ll hit limits fast. Max gives 5x more usage for comfortable practice.'}
              </p>
            </div>

            {/* API credits */}
            <div className="invest-el bg-white/[0.04] border border-white/10 rounded-xl p-6 mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-sans font-bold text-xl">{isHe ? 'שירותים חיצוניים' : 'API Services & Tools'}</h3>
                <span className="font-serif italic text-3xl text-signal-red">~$50</span>
              </div>
              <p className="font-sans text-sm text-white/40 leading-relaxed">
                {isHe
                  ? 'עלויות API לאורך הקורס — יצירת תמונות, סרטונים, קול, פרסום ועוד. המטרה היא לנסות באמת ולהבין את הערך של כל שירות.'
                  : 'API costs throughout the course — image generation, video, voice, publishing and more. The goal is to actually try things and understand the value of each service.'}
              </p>
            </div>

            <div className="invest-el">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                {isHe ? 'השקעה כוללת: ~$150 + מחיר הקורס' : 'Total investment: ~$150 + course price'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
