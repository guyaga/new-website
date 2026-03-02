import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.word-reveal', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    invalidateOnRefresh: true,
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.05,
                ease: 'power3.out'
            });

            gsap.from('.manifesto-bg', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true
                },
                y: 100,
                scale: 1.1,
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="relative py-32 md:py-64 bg-black overflow-hidden flex items-center min-h-[80vh]">
            {/* Parallax Background */}
            <div
                className="manifesto-bg absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-luminosity grayscale"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497215848520-25e243956bf1?q=80&w=2670&auto=format&fit=crop")' }}
            ></div>
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-white">
                <div className="mb-12">
                    {["Who", "is", "Guy?"].map((word, i) => (
                        <span key={i} className="word-reveal inline-block font-sans font-medium text-lg md:text-2xl text-paper/70 mr-2">
                            {word}
                        </span>
                    ))}
                </div>

                <div className="mt-8 leading-[1.1]">
                    {["Making", "AI:"].map((word, i) => (
                        <span key={i} className="word-reveal inline-block font-sans font-bold text-4xl md:text-7xl uppercase mr-4 tracking-tight">
                            {word}
                        </span>
                    ))}
                    <br className="hidden md:block" />
                    <div className="mt-4">
                        {["Practical, ", "Accessible, "].map((word, i) => (
                            <span key={i} className="word-reveal inline-block font-serif italic text-6xl md:text-9xl tracking-tighter mr-6">
                                {word}
                            </span>
                        ))}
                        <span className="word-reveal inline-block font-serif italic text-6xl md:text-9xl text-signal-red tracking-tighter mix-blend-screen">
                            Real.
                        </span>
                    </div>
                </div>

                {/* Bio Paragraphs */}
                <div className="mt-16 md:mt-24 max-w-2xl font-sans text-lg md:text-xl text-paper/80 leading-relaxed word-reveal">
                    With over 10 years of experience shaping digital products from Tel Aviv, Guy Aga lectures at academic institutions, collaborates with designers, architects, and agencies, and runs AI Academy — an educational platform empowering people to build independently with AI tools.
                </div>
                <div className="mt-6 max-w-2xl font-sans text-lg md:text-xl text-paper/60 leading-relaxed word-reveal">
                    His approach is hands-on and research-driven: bridging the gap between cutting-edge AI capabilities and real-world application, so that creative professionals and businesses can harness technology without losing their human edge.
                </div>
            </div>
        </section>
    );
}
