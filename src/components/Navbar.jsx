import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import ScrambleText from './ScrambleText';
import MagneticWrap from './MagneticWrap';

export default function Navbar() {
    const navRef = useRef(null);
    const overlayRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Animate overlay
    useEffect(() => {
        if (!overlayRef.current) return;
        if (menuOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
            gsap.from('.mobile-nav-link', { x: 40, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out', delay: 0.15 });
        }
    }, [menuOpen]);

    const closeMenu = useCallback(() => {
        if (!overlayRef.current) return;
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => setMenuOpen(false),
        });
    }, []);

    const handleHashLink = useCallback((hash) => {
        closeMenu();
        if (isHome) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/' + hash);
        }
    }, [isHome, navigate, closeMenu]);

    const handleContactClick = useCallback(() => {
        closeMenu();
        if (isHome) {
            const el = document.querySelector('#contact-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#contact-form');
        }
    }, [isHome, navigate, closeMenu]);

    const navLinks = [
        { label: 'About', hash: '#about' },
        { label: 'Services', hash: '#services' },
        { label: 'Portfolio', hash: '#portfolio' },
        { label: 'Blog', to: '/blog' },
    ];

    return (
        <>
            <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
                <nav
                    ref={navRef}
                    className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 max-w-4xl w-full ${isScrolled
                        ? 'bg-paper/80 backdrop-blur-xl border border-black/10 text-black'
                        : 'bg-transparent text-paper'
                        }`}
                >
                    <Link to="/" className="font-sans font-bold text-xl tracking-tight uppercase">
                        <ScrambleText text="Guyaga" />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex space-x-8 text-sm font-medium">
                        {navLinks.map((link) =>
                            link.to ? (
                                <Link key={link.label} to={link.to} className="hover:-translate-y-[1px] transition-transform">
                                    <ScrambleText text={link.label} />
                                </Link>
                            ) : (
                                <button
                                    key={link.label}
                                    onClick={() => handleHashLink(link.hash)}
                                    className="hover:-translate-y-[1px] transition-transform"
                                >
                                    <ScrambleText text={link.label} />
                                </button>
                            )
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <MagneticWrap>
                            <button
                                onClick={handleContactClick}
                                className="relative overflow-hidden group bg-signal-red text-white px-5 py-2 rounded-full font-sans font-semibold text-sm transition-transform hidden md:block"
                            >
                                <span className="relative z-10">Contact Me</span>
                                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                            </button>
                        </MagneticWrap>

                        {/* Hamburger button (mobile) */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="md:hidden p-2 -mr-2"
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile overlay */}
            {menuOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-[60] bg-black text-white flex flex-col opacity-0"
                >
                    <div className="flex items-center justify-between px-8 py-6">
                        <span className="font-sans font-bold text-xl tracking-tight uppercase">Guyaga</span>
                        <button onClick={closeMenu} aria-label="Close menu" className="p-2 -mr-2">
                            <X size={28} />
                        </button>
                    </div>

                    <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
                        {navLinks.map((link) => (
                            <div key={link.label} className="mobile-nav-link">
                                {link.to ? (
                                    <Link
                                        to={link.to}
                                        onClick={closeMenu}
                                        className="font-sans font-bold text-4xl uppercase tracking-tight hover:text-signal-red transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleHashLink(link.hash)}
                                        className="font-sans font-bold text-4xl uppercase tracking-tight hover:text-signal-red transition-colors text-left"
                                    >
                                        {link.label}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="mobile-nav-link pt-4">
                            <button
                                onClick={handleContactClick}
                                className="bg-signal-red text-white px-8 py-3 rounded-full font-sans font-semibold text-lg"
                            >
                                Contact Me
                            </button>
                        </div>
                    </nav>

                    <div className="px-8 py-6">
                        <p className="font-mono text-xs text-white/30 uppercase">Guy@aga.digital</p>
                    </div>
                </div>
            )}
        </>
    );
}
