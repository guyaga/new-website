import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPortfolioBySlug } from '../utils/portfolio';

export default function PortfolioDetail() {
    const { slug } = useParams();
    const project = getPortfolioBySlug(slug);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!project || !contentRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.portfolio-animate', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
            });
        }, contentRef);
        return () => ctx.revert();
    }, [project]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(i + 1, imageMedia.length - 1));
            if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(i - 1, 0));
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [lightboxIndex]);

    if (!project) {
        return (
            <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen text-center">
                <h1 className="font-sans font-bold text-3xl mb-4">Project Not Found</h1>
                <Link to="/#portfolio" className="font-mono text-sm text-signal-red hover:underline">
                    &larr; Back to portfolio
                </Link>
            </main>
        );
    }

    const videoMedia = project.media.filter((m) => m.media_type === 'video');
    const imageMedia = project.media.filter((m) => m.media_type === 'image');

    return (
        <>
            <Helmet>
                <title>{project.title} — Guy Aga</title>
                <meta name="description" content={project.short_description || project.description} />
                {project.featured_image && <meta property="og:image" content={project.featured_image} />}
            </Helmet>

            <main ref={contentRef} className="pt-32 pb-24 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Back link */}
                    <div className="portfolio-animate mb-8">
                        <Link
                            to="/#portfolio"
                            className="inline-flex items-center gap-2 font-mono text-sm text-black/40 hover:text-signal-red transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Portfolio
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="portfolio-animate mb-12">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="font-mono text-[10px] uppercase px-3 py-1 bg-black text-white rounded-full">
                                {project.type === 'video' ? 'Video' : project.type === 'gallery' ? 'Gallery' : 'Project'}
                            </span>
                            {project.client_name && (
                                <span className="font-mono text-[10px] uppercase px-3 py-1 bg-paper text-black/60 rounded-full">
                                    {project.client_name}
                                </span>
                            )}
                            {project.technologies?.map((tech) => (
                                <span key={tech} className="font-mono text-[10px] uppercase px-3 py-1 bg-paper text-black/40 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <h1 className="font-sans font-bold text-3xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-tight">
                            {project.title}
                        </h1>
                    </header>

                    {/* Featured image / hero */}
                    <div className="portfolio-animate rounded-2xl overflow-hidden mb-12">
                        <img
                            src={project.featured_image}
                            alt={project.title}
                            className="w-full h-auto max-h-[70vh] object-cover"
                        />
                    </div>

                    {/* Description */}
                    <div className="portfolio-animate max-w-prose mb-16">
                        <p className="font-sans text-lg md:text-xl text-black/70 leading-relaxed">
                            {project.long_description || project.short_description || project.description}
                        </p>
                    </div>

                    {/* Video embeds */}
                    {videoMedia.length > 0 && (
                        <div className="portfolio-animate mb-16">
                            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-6">Video</p>
                            <div className="space-y-8">
                                {videoMedia.map((v) => (
                                    <div key={v.id} className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                                        <iframe
                                            src={v.media_url}
                                            title={project.title}
                                            className="absolute inset-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image gallery */}
                    {imageMedia.length > 0 && (
                        <div className="portfolio-animate mb-16">
                            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-6">
                                Gallery ({imageMedia.length} {imageMedia.length === 1 ? 'image' : 'images'})
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {imageMedia.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setLightboxIndex(idx)}
                                        className="group relative rounded-xl overflow-hidden bg-paper aspect-square cursor-pointer"
                                    >
                                        <img
                                            src={img.media_url}
                                            alt={`${project.title} — ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Project details */}
                    {project.content && (
                        <div className="portfolio-animate border-t border-black/10 pt-12">
                            {project.content.production_highlights?.length > 0 && (
                                <div className="mb-8">
                                    <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-4">Highlights</p>
                                    <ul className="space-y-2">
                                        {project.content.production_highlights.map((h, i) => (
                                            <li key={i} className="flex items-start gap-3 font-sans text-black/70">
                                                <span className="w-1.5 h-1.5 rounded-full bg-signal-red mt-2 shrink-0" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox */}
            {lightboxIndex !== null && imageMedia[lightboxIndex] && (
                <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 text-white/60 hover:text-white p-2 z-10"
                        aria-label="Close"
                    >
                        <X size={28} />
                    </button>

                    {lightboxIndex > 0 && (
                        <button
                            onClick={() => setLightboxIndex((i) => i - 1)}
                            className="absolute left-4 md:left-8 text-white/40 hover:text-white p-2 z-10"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={36} />
                        </button>
                    )}

                    {lightboxIndex < imageMedia.length - 1 && (
                        <button
                            onClick={() => setLightboxIndex((i) => i + 1)}
                            className="absolute right-4 md:right-8 text-white/40 hover:text-white p-2 z-10"
                            aria-label="Next"
                        >
                            <ChevronRight size={36} />
                        </button>
                    )}

                    <img
                        src={imageMedia[lightboxIndex].media_url}
                        alt={`${project.title} — ${lightboxIndex + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain"
                    />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
                        {lightboxIndex + 1} / {imageMedia.length}
                    </div>
                </div>
            )}
        </>
    );
}
