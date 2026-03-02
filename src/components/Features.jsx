import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';
import { getAllPortfolioWithMedia } from '../utils/portfolio';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
    const containerRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const projects = getAllPortfolioWithMedia();

    useEffect(() => {
        if (projects.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    invalidateOnRefresh: true,
                },
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: 'power3.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, [activeFilter]);

    const typeIcon = (type) => {
        if (type === 'video') return <Play size={14} />;
        return null;
    };

    const typeLabel = (type) => {
        switch (type) {
            case 'video': return 'Video';
            case 'gallery': return 'Gallery';
            default: return 'Project';
        }
    };

    const filters = ['all', 'video', 'gallery', 'single_image'];
    const filterLabels = { all: 'All Work', video: 'Video', gallery: 'Gallery', single_image: 'Projects' };

    const filtered = activeFilter === 'all'
        ? projects
        : projects.filter((p) => p.type === activeFilter);

    return (
        <section id="portfolio" ref={containerRef} className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">Selected Work</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase">Portfolio</h2>
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase transition-all duration-300 ${activeFilter === f
                                    ? 'bg-black text-white'
                                    : 'bg-paper text-black/50 hover:text-black'
                                    }`}
                            >
                                {filterLabels[f]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => (
                    <Link
                        key={project.id}
                        to={`/portfolio/${project.slug}`}
                        className="feature-card group block"
                    >
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                            <img
                                src={project.featured_image}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full font-mono text-[10px] uppercase">
                                {typeIcon(project.type)}
                                {typeLabel(project.type)}
                                {project.media.length > 1 && (
                                    <span className="ml-1 opacity-60">&middot; {project.media.length}</span>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h3 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight mb-1 group-hover:text-signal-red transition-colors">
                                    {project.title}
                                </h3>
                                <p className="font-mono text-[11px] text-white/50 uppercase line-clamp-1">
                                    {project.client_name || project.technologies?.join(' · ') || project.categories?.join(' · ') || 'Creative Project'}
                                </p>
                            </div>

                            {project.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-16 h-16 rounded-full bg-signal-red/90 flex items-center justify-center">
                                        <Play size={24} className="text-white ml-1" fill="white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
