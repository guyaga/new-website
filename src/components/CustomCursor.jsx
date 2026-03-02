import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
            gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });

            const xToCursor = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3" });
            const yToCursor = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3" });

            const xToDot = gsap.quickTo(dotRef.current, "x", { duration: 0.05, ease: "power3" });
            const yToDot = gsap.quickTo(dotRef.current, "y", { duration: 0.05, ease: "power3" });

            const onMouseMove = (e) => {
                xToCursor(e.clientX);
                yToCursor(e.clientY);
                xToDot(e.clientX);
                yToDot(e.clientY);
            };

            window.addEventListener("mousemove", onMouseMove);

            // Add hover states for interactive elements
            const handleMouseEnter = () => {
                gsap.to(cursorRef.current, { scale: 3, backgroundColor: 'rgba(230,59,46,0.1)', borderColor: 'transparent', duration: 0.3 });
                gsap.to(dotRef.current, { scale: 0, duration: 0.3 });
            };

            const handleMouseLeave = () => {
                gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(230,59,46,0.5)', duration: 0.3 });
                gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
            };

            // Apply to all links and buttons dynamically
            const attachHoverListeners = () => {
                const interactives = document.querySelectorAll('a, button');
                interactives.forEach(el => {
                    el.addEventListener('mouseenter', handleMouseEnter);
                    el.addEventListener('mouseleave', handleMouseLeave);
                });
            };

            attachHoverListeners();

            // Re-run attachment periodically if DOM updates happen
            const observer = new MutationObserver(() => {
                attachHoverListeners();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            return () => {
                window.removeEventListener("mousemove", onMouseMove);
                observer.disconnect();
            };
        });

        return () => ctx.revert();
    }, []);

    return (
        <>
            {/* Outer Ring */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-signal-red/50 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
            ></div>
            {/* Inner Dot */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-signal-red pointer-events-none z-[9999] hidden md:block"
            ></div>
        </>
    );
}
