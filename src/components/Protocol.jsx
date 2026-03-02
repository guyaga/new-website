import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        num: '01',
        title: 'Web Design & Development',
        desc: 'Crafting fast, responsive, and visually stunning websites that convert visitors into customers.',
        AnimComponent: AnalyzingPulse
    },
    {
        num: '02',
        title: 'Digital Architecture',
        desc: 'Designing robust and flexible systems that support long-term growth and technical stability.',
        AnimComponent: LaserScanner
    },
    {
        num: '03',
        title: 'AI Strategy & Implementation',
        desc: 'Helping businesses leverage the power of AI to optimize workflows and enhance decision-making.',
        AnimComponent: EKGWave
    }
];

export default function Protocol() {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        // We pin the container and animate the cards
        // A standard stacking card effect with GSAP

        let ctx = gsap.context(() => {
            cardsRef.current.forEach((card, index) => {
                if (index === 0) return; // Skip the first one

                const prevCard = cardsRef.current[index - 1];

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true,
                    invalidateOnRefresh: true,
                    animation: gsap.to(prevCard, {
                        scale: 0.9,
                        opacity: 0.5,
                        filter: 'blur(10px)',
                        transformOrigin: 'top center',
                        ease: 'none',
                    }),
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="services" ref={containerRef} className="bg-paper pb-24 relative">
            {steps.map((step, i) => (
                <div
                    key={i}
                    ref={el => cardsRef.current[i] = el}
                    className="sticky top-0 w-full h-[100vh] bg-off-white border-t border-black p-8 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden"
                    style={{ zIndex: i + 1 }}
                >
                    <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10 pt-12 md:pt-0">
                        <span className="font-mono text-signal-red text-xl mb-2 md:mb-4 font-bold block">{step.num} /</span>
                        <h2 className="font-sans font-bold text-4xl md:text-8xl tracking-tight uppercase mb-4 md:mb-6 leading-none">
                            {step.title}
                        </h2>
                        <p className="font-sans text-2xl text-black/70 max-w-lg">
                            {step.desc}
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 h-64 md:h-[80%] bg-paper border border-black flex items-center justify-center relative overflow-hidden">
                        <step.AnimComponent />
                    </div>
                </div>
            ))}
            <div className="h-[20vh]"></div> {/* Spacing at the bottom so the last card scrolls up normally */}
        </section>
    );
}

// 1. Rotating Geometric Motif
function AnalyzingPulse() {
    const ref = useRef(null);
    useEffect(() => {
        gsap.to(ref.current, { rotation: 360, duration: 20, repeat: -1, ease: 'linear' });
    }, []);

    return (
        <div ref={ref} className="relative w-48 h-48">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute inset-0 border border-black/20 rounded-full"
                    style={{
                        transform: `scale(${1 - i * 0.15})`,
                        borderStyle: i % 2 === 0 ? 'solid' : 'dashed'
                    }}
                ></div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-signal-red rounded-full shadow-[0_0_15px_rgba(230,59,46,0.8)]"></div>
        </div>
    );
}

// 2. Laser Scanner
function LaserScanner() {
    const laserRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(laserRef.current,
            { top: '0%' },
            { top: '100%', duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' }
        );
    }, []);

    return (
        <div className="relative w-full h-full p-8 flex flex-col gap-4 max-w-sm">
            <div className="flex justify-between font-mono text-xs text-black/40"><span className="animate-pulse">Scanning Grid</span><span>v2.0</span></div>
            <div className="flex-1 grid grid-cols-6 grid-rows-4 gap-2 relative">
                {[...Array(24)].map((_, i) => (
                    <div key={i} className={`w-full h-full bg-black/${Math.random() > 0.7 ? '20' : '5'} rounded-sm`}></div>
                ))}
                {/* Laser Line */}
                <div ref={laserRef} className="absolute left-0 w-full h-[2px] bg-signal-red shadow-[0_0_10px_rgba(230,59,46,0.8)] z-10" />
            </div>
        </div>
    );
}

// 3. EKG Waveform
function EKGWave() {
    return (
        <div className="relative w-full px-12">
            <svg viewBox="0 0 400 100" className="w-full stroke-signal-red stroke-2 fill-none overflow-visible">
                <path
                    d="M 0 50 L 100 50 L 120 20 L 150 90 L 180 10 L 210 70 L 230 50 L 400 50"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    className="animate-[dash_3s_linear_infinite]"
                />
                <style>{`
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
            </svg>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-black/50">120 BPM : STABLE</div>
        </div>
    );
}
