import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
    const containerRef = useRef(null);
    const [text, setText] = useState('');
    const bootSequence = [
        'INIT SYSTEM...',
        'LOADING LOCAL KERNEL',
        'MOUNTING VOLUMES [OK]',
        'BYPASSING SECURITY PROTOCOLS [OK]',
        'TRUTH EXTRACTION: ACTIVE'
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Simulate typing lines quickly
            let delay = 0;
            bootSequence.forEach((line, i) => {
                setTimeout(() => {
                    setText(prev => prev + line + '\n');
                }, delay);
                delay += 150 + Math.random() * 100; // fast typing
            });

            // Snapping out
            setTimeout(() => {
                gsap.to(containerRef.current, {
                    y: '-100%',
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        if (onComplete) onComplete();
                    } // callback to unlock scroll or trigger hero
                });
            }, delay + 400); // give it a beat after the last text
        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black text-signal-red flex flex-col justify-end p-8 font-mono text-sm pointer-events-none"
        >
            <div className="whitespace-pre-wrap leading-tight">{text}</div>
            <div className="mt-2 animate-pulse w-3 h-4 bg-signal-red"></div>
        </div>
    );
}
