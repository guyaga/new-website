import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { useLanguage, createT } from '../../i18n';

gsap.registerPlugin(ScrollTrigger);

const FAQ_KEYS = [
  { q: 'course.faq.q1', a: 'course.faq.a1' },
  { q: 'course.faq.q2', a: 'course.faq.a2' },
  { q: 'course.faq.q3', a: 'course.faq.a3' },
  { q: 'course.faq.q4', a: 'course.faq.a4' },
  { q: 'course.faq.q5', a: 'course.faq.a5' },
];

export default function CourseFAQ() {
  const containerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const { lang } = useLanguage();
  const t = createT(lang);
  const isHe = lang === 'he';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
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
    <section ref={containerRef} className="py-24 md:py-40 bg-black text-white" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6">
        <p className="font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
          {t('course.faq.label')}
        </p>
        <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase mb-12">
          {t('course.faq.heading')}
        </h2>

        <div className="space-y-0">
          {FAQ_KEYS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="faq-item border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-start group"
                >
                  <span className="font-sans font-semibold text-base md:text-lg text-white/90 group-hover:text-signal-red transition-colors pe-4">
                    {t(faq.q)}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="font-sans text-sm text-white/50 leading-relaxed">
                    {t(faq.a)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
