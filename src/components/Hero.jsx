import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-part', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[100dvh] overflow-hidden flex items-end border-b border-black">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("/hero-bg.jpg")'
                }}
            ></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-paper/20 mix-blend-multiply"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            {/* Content Bottom Left Third */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32 flex flex-col items-start w-full md:w-2/3">
                <p className="hero-part font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-paper/60 mb-6">
                    Digital Strategist · AI Educator · Product Creator
                </p>
                <h1 className="flex flex-col uppercase">
                    <span className="hero-part font-sans font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter text-paper mb-2">
                        Transform the
                    </span>
                    <span className="hero-part font-serif italic text-6xl md:text-8xl lg:text-[11rem] leading-none tracking-tight text-white mb-4">
                        Reality.
                    </span>
                </h1>
                <p className="hero-part font-sans text-sm md:text-base text-signal-red font-bold tracking-wide mb-8">
                    10+ Years Shaping Digital Products
                </p>
                <div className="hero-part">
                    <a
                        href="#contact"
                        className="group relative overflow-hidden bg-signal-red text-white px-8 py-4 rounded-full font-sans font-bold text-lg tracking-wide transition-transform hover:scale-[1.03] inline-block"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                    >
                        <span className="relative z-10">Get in Touch</span>
                        <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                    </a>
                </div>
            </div>
        </div>
    );
}
