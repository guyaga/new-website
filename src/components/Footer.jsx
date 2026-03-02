import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    const handleHashLink = (hash) => {
        if (isHome) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/' + hash);
        }
    };

    return (
        <footer className="w-full bg-black text-white px-8 pt-20 pb-8 relative z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
                <div className="max-w-md">
                    <h2 className="font-sans font-bold text-4xl tracking-tighter uppercase mb-4">Guyaga</h2>
                    <p className="font-mono text-sm text-paper/60 uppercase">AI Strategy. Digital Products. Education & Workshops.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 md:gap-16 font-sans">
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-xs text-paper/40 mb-2 uppercase">Index</span>
                        <button onClick={() => handleHashLink('#about')} className="hover:text-signal-red transition-colors text-left">About</button>
                        <button onClick={() => handleHashLink('#services')} className="hover:text-signal-red transition-colors text-left">Services</button>
                        <button onClick={() => handleHashLink('#portfolio')} className="hover:text-signal-red transition-colors text-left">Portfolio</button>
                        <Link to="/blog" className="hover:text-signal-red transition-colors">Blog</Link>
                        <a href="https://ai-academy.co.il" target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">AI Academy</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-xs text-paper/40 mb-2 uppercase">Contact</span>
                        <p className="text-paper/80">Tel Aviv, Israel</p>
                        <a href="mailto:Guy@aga.digital" className="hover:text-signal-red transition-colors text-paper/80">Guy@aga.digital</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-xs text-paper/40 mb-2 uppercase">Socials</span>
                        <a href="https://www.linkedin.com/in/guyaga/" target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">LinkedIn</a>
                        <a href="https://www.youtube.com/channel/UCc0ZbMyx7brZhdHf1G6ud2A" target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">YouTube</a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">Instagram</a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">Facebook</a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-mono text-xs tracking-widest text-paper/50">SYSTEM OPERATIONAL_</span>
                </div>
                <div className="font-mono text-xs text-paper/30">
                    © {new Date().getFullYear()} Guyaga Protocol. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
