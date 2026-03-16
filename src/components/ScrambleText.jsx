import { useState, useRef, useEffect } from 'react';

const CHARS = 'XYZ#$!01*+><';

export default function ScrambleText({ text, className }) {
    const [displayText, setDisplayText] = useState(text);
    const isScrambling = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync displayText when text prop changes from language toggle
        if (!isScrambling.current) setDisplayText(text);
    }, [text]);

    const startScramble = () => {
        if (isScrambling.current) return;
        isScrambling.current = true;

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                prev.split('').map((char, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    if (text[index] === ' ') return ' ';
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                isScrambling.current = false;
                setDisplayText(text);
            }

            iteration += 1 / 2; // Speed of resolving letters
        }, 40);
    };

    return (
        <span
            className={className}
            onMouseEnter={startScramble}
        >
            {displayText}
        </span>
    );
}
