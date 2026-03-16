import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { useLanguage, createT } from '../i18n';

gsap.registerPlugin(ScrollTrigger);

const testimonialData = [
    { id: 1, name: "Etgar Shafir", quoteKey: 'testimonials.1.quote', titleKey: 'testimonials.1.title' },
    { id: 2, name: "Yishai Katz Sheinfeld", quoteKey: 'testimonials.2.quote', titleKey: 'testimonials.2.title' },
    { id: 3, name: "Shai Cohen", quoteKey: 'testimonials.3.quote', titleKey: 'testimonials.3.title' },
    { id: 4, name: "Maya Shoshni", quoteKey: 'testimonials.4.quote', titleKey: 'testimonials.4.title' },
    { id: 5, name: "Talia Maor", quoteKey: 'testimonials.5.quote', titleKey: 'testimonials.5.title' },
    { id: 6, name: "Rafi Tal", quoteKey: 'testimonials.6.quote', titleKey: 'testimonials.6.title' },
    { id: 7, name: "Adam Oberlander", quoteKey: 'testimonials.7.quote', titleKey: 'testimonials.7.title' },
    { id: 8, name: "Noy", quoteKey: 'testimonials.8.quote', titleKey: 'testimonials.8.title' },
];

export default function Testimonials() {
    const containerRef = useRef(null);
    const [active, setActive] = useState(0);
    const intervalRef = useRef(null);
    const { lang } = useLanguage();
    const t = createT(lang);

    const startAutoRotate = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % testimonialData.length);
        }, 5000);
    }, []);

    useEffect(() => {
        startAutoRotate();
        return () => clearInterval(intervalRef.current);
    }, [startAutoRotate]);

    const goTo = (index) => {
        setActive(index);
        startAutoRotate();
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonial-header', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    invalidateOnRefresh: true,
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });

            gsap.from('.testimonial-featured', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 65%',
                    invalidateOnRefresh: true,
                },
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
            });

            gsap.from('.testimonial-card', {
                scrollTrigger: {
                    trigger: '.testimonial-grid',
                    start: 'top 80%',
                    invalidateOnRefresh: true,
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const featured = testimonialData[active];
    const miniCards = testimonialData.filter((_, i) => i !== active).slice(0, 3);

    return (
        <section ref={containerRef} className="relative py-24 md:py-40 bg-paper overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <div className="testimonial-header mb-16">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 block mb-4">
                        {t('testimonials.label')}
                    </span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase">
                        {t('testimonials.heading')}
                    </h2>
                </div>

                {/* Featured Quote */}
                <div className="testimonial-featured mb-16">
                    <div className="relative">
                        <Quote className="text-signal-red/20 w-12 h-12 md:w-16 md:h-16 mb-6" />
                        <blockquote
                            key={featured.id}
                            className="font-serif italic text-2xl md:text-4xl lg:text-5xl leading-snug tracking-tight text-black/90 max-w-3xl transition-opacity duration-500"
                        >
                            "{t(featured.quoteKey)}"
                        </blockquote>
                        <div className="mt-8 flex flex-col">
                            <span className="font-sans font-bold text-lg text-black">
                                {featured.name}
                            </span>
                            <span className="font-mono text-sm text-black/50 mt-1">
                                {t(featured.titleKey)}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex gap-2 mt-8">
                        {testimonialData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    i === active
                                        ? 'bg-signal-red scale-125'
                                        : 'bg-black/20 hover:bg-black/40'
                                }`}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Mini Cards */}
                <div className="testimonial-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                    {miniCards.map((item) => (
                        <div
                            key={item.id}
                            className="testimonial-card bg-white border border-black/10 p-6 rounded-sm hover:border-signal-red/30 transition-colors cursor-pointer"
                            onClick={() => goTo(testimonialData.findIndex(x => x.id === item.id))}
                        >
                            <Quote className="text-black/10 w-6 h-6 mb-3" />
                            <p className="font-sans text-sm text-black/70 leading-relaxed mb-4">
                                "{t(item.quoteKey)}"
                            </p>
                            <div className="border-t border-black/10 pt-3">
                                <span className="font-sans font-bold text-sm text-black block">
                                    {item.name}
                                </span>
                                <span className="font-mono text-xs text-black/40">
                                    {t(item.titleKey)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
