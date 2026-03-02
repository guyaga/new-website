import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticWrap({ children, scale = 1.03, strength = 0.5 }) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        const element = wrapperRef.current;

        // xTo and yTo map mouse movement to structural transform shifts
        const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = element.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * strength);
            yTo(y * strength);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={wrapperRef} className="inline-block relative">
            {children}
        </div>
    );
}
