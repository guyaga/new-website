import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        name: "Etgar Shafir",
        title: 'Author, "Marketing in Digital World"',
        quote: "Always researches thoroughly and extracts the most interesting insights",
    },
    {
        id: 2,
        name: "Yishai Katz Sheinfeld",
        title: "VP Marketing, Ono Academic College",
        quote: "Stays updated, finds effective solutions, recognized industry leader",
    },
    {
        id: 3,
        name: "Shai Cohen",
        title: "Ptztz Media Owner",
        quote: "Demonstrates professionalism, breadth of expertise, and leadership drive",
    },
    {
        id: 4,
        name: "Maya Shoshni",
        title: "Creative AI Specialist",
        quote: "Makes learning practical; helps maximize capabilities and translate to financial gain",
    },
    {
        id: 5,
        name: "Talia Maor",
        title: "AI Learner, Marketing Manager",
        quote: "Closest to AI capabilities in Israel; has amazing, creative, intelligent mind",
    },
    {
        id: 6,
        name: "Rafi Tal",
        title: "CEO, HapPpy",
        quote: "Always innovates, finds efficient uses, shares knowledge practically and pleasantly",
    },
    {
        id: 7,
        name: "Adam Oberlander",
        title: "Photographer/Digital",
        quote: "Full of knowledge, explains thoroughly, teaches with passion and creativity",
    },
    {
        id: 8,
        name: "Noy",
        title: "Student",
        quote: "Amazing knowledge, genius teacher, explains patiently with smile and enthusiasm",
    },
];

export default function Testimonials() {
    const containerRef = useRef(null);
    const [active, setActive] = useState(0);
    const intervalRef = useRef(null);

    const startAutoRotate = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % testimonials.length);
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

    const featured = testimonials[active];
    const miniCards = testimonials.filter((_, i) => i !== active).slice(0, 3);

    return (
        <section ref={containerRef} className="relative py-24 md:py-40 bg-paper overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <div className="testimonial-header mb-16">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/40 block mb-4">
                        What People Say
                    </span>
                    <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-tight uppercase">
                        Testimonials
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
                            "{featured.quote}"
                        </blockquote>
                        <div className="mt-8 flex flex-col">
                            <span className="font-sans font-bold text-lg text-black">
                                {featured.name}
                            </span>
                            <span className="font-mono text-sm text-black/50 mt-1">
                                {featured.title}
                            </span>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex gap-2 mt-8">
                        {testimonials.map((_, i) => (
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
                    {miniCards.map((t) => (
                        <div
                            key={t.id}
                            className="testimonial-card bg-white border border-black/10 p-6 rounded-sm hover:border-signal-red/30 transition-colors cursor-pointer"
                            onClick={() => goTo(testimonials.findIndex(x => x.id === t.id))}
                        >
                            <Quote className="text-black/10 w-6 h-6 mb-3" />
                            <p className="font-sans text-sm text-black/70 leading-relaxed mb-4">
                                "{t.quote}"
                            </p>
                            <div className="border-t border-black/10 pt-3">
                                <span className="font-sans font-bold text-sm text-black block">
                                    {t.name}
                                </span>
                                <span className="font-mono text-xs text-black/40">
                                    {t.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
