import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPortfolioBySlug, getPortfolioItems } from '../utils/portfolio';
import { useLanguage, createT } from '../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const pageRef = useRef(null);
    const heroImageRef = useRef(null);
    const { lang } = useLanguage();
    const t = createT(lang);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getPortfolioBySlug(slug),
            getPortfolioItems(),
        ]).then(([projectData, allData]) => {
            setProject(projectData);
            setAllProjects(allData);
            setLoading(false);
        });
    }, [slug]);

    const videoMedia = useMemo(() => project?.media?.filter((m) => m.media_type === 'video') || [], [project]);
    const imageMedia = useMemo(() => project?.media?.filter((m) => m.media_type === 'image') || [], [project]);
    const instagramMedia = useMemo(() => project?.media?.filter((m) => m.media_type === 'instagram') || [], [project]);

    // Compute prev/next projects
    const { prevProject, nextProject } = useMemo(() => {
        if (!project || allProjects.length === 0) return { prevProject: null, nextProject: null };
        const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
        if (currentIndex === -1) return { prevProject: null, nextProject: null };
        return {
            prevProject: currentIndex > 0 ? allProjects[currentIndex - 1] : null,
            nextProject: currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null,
        };
    }, [project, allProjects]);

    // GSAP animations
    useEffect(() => {
        if (!project || !pageRef.current) return;

        const ctx = gsap.context(() => {
            // Hero parallax
            if (heroImageRef.current) {
                gsap.to(heroImageRef.current, {
                    y: -50,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroImageRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }

            // Content sections fade in
            gsap.utils.toArray('.pd-animate').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            // Sidebar metadata
            gsap.from('.pd-sidebar', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.pd-sidebar',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });

            // Gallery images stagger
            gsap.utils.toArray('.pd-gallery-item').forEach((el, i) => {
                gsap.from(el, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            // Next/prev section
            gsap.from('.pd-nav-section', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.pd-nav-section',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        }, pageRef);

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
    }, [lightboxIndex, imageMedia.length]);

    // Load Instagram embed script
    useEffect(() => {
        if (instagramMedia.length === 0) return;
        if (window.instgrm) {
            window.instgrm.Embeds.process();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => window.instgrm?.Embeds.process();
        document.body.appendChild(script);
    }, [instagramMedia]);

    // Scroll to top on slug change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen">
                <div className="h-[70vh] bg-paper animate-pulse" />
                <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse space-y-8">
                    <div className="h-4 bg-paper rounded w-32" />
                    <div className="h-8 bg-paper rounded w-2/3" />
                    <div className="h-4 bg-paper rounded w-1/2" />
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen text-center">
                <h1 className="font-sans font-bold text-3xl mb-4">{t('portfolio.notFound')}</h1>
                <Link to="/#portfolio" className="font-mono text-sm text-signal-red hover:underline inline-flex items-center gap-1">
                    <span className="rtl:rotate-180">&larr;</span> {t('portfolio.backToPortfolio')}
                </Link>
            </main>
        );
    }

    const typeLabel = project.type === 'video'
        ? t('portfolio.typeVideo')
        : project.type === 'gallery'
            ? t('portfolio.typeGallery')
            : project.type === 'instagram'
                ? t('portfolio.typeInstagram')
                : t('portfolio.typeProject');

    const projectYear = project.created_at
        ? new Date(project.created_at).getFullYear()
        : null;

    // Build alternating gallery layout
    const renderGallery = () => {
        const items = [];
        let i = 0;
        while (i < imageMedia.length) {
            // Full-width image
            items.push(
                <button
                    key={imageMedia[i].id}
                    onClick={() => setLightboxIndex(i)}
                    className="pd-gallery-item group relative rounded-xl overflow-hidden bg-paper cursor-pointer w-full"
                >
                    <img
                        src={imageMedia[i].media_url}
                        alt={`${project.title} — ${i + 1}`}
                        className="w-full h-auto max-h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
            );
            i++;

            // Two side-by-side images
            if (i < imageMedia.length) {
                const pair = [];
                const idx1 = i;
                pair.push(
                    <button
                        key={imageMedia[idx1].id}
                        onClick={() => setLightboxIndex(idx1)}
                        className="pd-gallery-item group relative rounded-xl overflow-hidden bg-paper cursor-pointer aspect-[4/3]"
                    >
                        <img
                            src={imageMedia[idx1].media_url}
                            alt={`${project.title} — ${idx1 + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </button>
                );
                i++;

                if (i < imageMedia.length) {
                    const idx2 = i;
                    pair.push(
                        <button
                            key={imageMedia[idx2].id}
                            onClick={() => setLightboxIndex(idx2)}
                            className="pd-gallery-item group relative rounded-xl overflow-hidden bg-paper cursor-pointer aspect-[4/3]"
                        >
                            <img
                                src={imageMedia[idx2].media_url}
                                alt={`${project.title} — ${idx2 + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </button>
                    );
                    i++;
                }

                items.push(
                    <div key={`pair-${idx1}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pair}
                    </div>
                );
            }
        }
        return items;
    };

    return (
        <>
            <Helmet>
                <title>{project.title} — Guy Aga</title>
                <meta name="description" content={project.short_description || project.description} />
                {project.featured_image && <meta property="og:image" content={project.featured_image} />}
            </Helmet>

            <div ref={pageRef}>
                {/* ─── Full-Bleed Cinematic Hero ─── */}
                {project.featured_image && (
                    <section className="relative h-[70vh] w-full overflow-hidden">
                        <img
                            ref={heroImageRef}
                            src={project.featured_image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-[calc(100%+50px)] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Back link — top left */}
                        <Link
                            to="/#portfolio"
                            className="absolute top-28 left-6 md:left-10 z-10 inline-flex items-center gap-2 font-mono text-xs text-white/70 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} className="rtl:rotate-180" />
                            {t('portfolio.backToPortfolio')}
                        </Link>

                        {/* Type badge + client — top right */}
                        <div className="absolute top-28 right-6 md:right-10 z-10 flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase px-3 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full">
                                {typeLabel}
                            </span>
                            {project.client_name && (
                                <span className="font-mono text-[10px] uppercase px-3 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full">
                                    {project.client_name}
                                </span>
                            )}
                        </div>

                        {/* Title — bottom left */}
                        <div className="absolute bottom-10 left-6 md:left-10 right-6 md:right-10 z-10">
                            <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[0.95] text-white max-w-4xl">
                                {project.title}
                            </h1>
                        </div>
                    </section>
                )}

                {/* ─── Two-Column Content ─── */}
                <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Left column — 2/3 */}
                        <div className="lg:w-2/3 space-y-16">
                            {/* Description */}
                            <div className="pd-animate">
                                <p className="font-sans text-lg md:text-xl text-black/70 leading-relaxed">
                                    {project.long_description || project.short_description || project.description}
                                </p>
                            </div>

                            {/* Primary video (first one, large) */}
                            {videoMedia.length > 0 && (
                                <div className="pd-animate">
                                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-6">
                                        {t('portfolio.videoSection')}
                                    </p>
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                                        <iframe
                                            src={videoMedia[0].media_url}
                                            title={project.title}
                                            className="absolute inset-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Additional videos in 2-column grid */}
                            {videoMedia.length > 1 && (
                                <div className="pd-animate grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {videoMedia.slice(1).map((v) => (
                                        <div key={v.id} className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
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
                            )}

                            {/* Instagram embeds */}
                            {instagramMedia.length > 0 && (
                                <div className="pd-animate">
                                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-6">
                                        {t('portfolio.instagramSection')}
                                    </p>
                                    <div className="space-y-6 flex flex-col items-center">
                                        {instagramMedia.map((m) => {
                                            const permalink = m.media_url.replace(/\/embed\/?$/, '/');
                                            return (
                                                <div key={m.id} className="w-full max-w-[540px]">
                                                    <blockquote
                                                        className="instagram-media"
                                                        data-instgrm-captioned
                                                        data-instgrm-permalink={permalink}
                                                        style={{
                                                            background: '#FFF',
                                                            border: 0,
                                                            borderRadius: '12px',
                                                            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
                                                            margin: '0 auto',
                                                            maxWidth: '540px',
                                                            minWidth: '326px',
                                                            padding: 0,
                                                            width: '100%',
                                                        }}
                                                    >
                                                        <a href={permalink} target="_blank" rel="noopener noreferrer"
                                                            className="block text-center p-16 font-mono text-xs text-black/40"
                                                        >
                                                            View on Instagram
                                                        </a>
                                                    </blockquote>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Production highlights */}
                            {project.content?.production_highlights?.length > 0 && (
                                <div className="pd-animate">
                                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-6">
                                        {t('portfolio.highlights')}
                                    </p>
                                    <ul className="space-y-3">
                                        {project.content.production_highlights.map((h, i) => (
                                            <li key={i} className="flex items-start gap-3 font-sans text-black/70">
                                                <span className="w-1.5 h-1.5 rounded-full bg-signal-red mt-2 shrink-0" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Image gallery — alternating layout */}
                            {imageMedia.length > 0 && (
                                <div className="pd-animate">
                                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-6">
                                        {t('portfolio.gallerySection')} ({imageMedia.length} {imageMedia.length === 1 ? t('portfolio.image') : t('portfolio.images')})
                                    </p>
                                    <div className="space-y-4">
                                        {renderGallery()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column — 1/3, sticky metadata */}
                        <aside className="lg:w-1/3">
                            <div className="pd-sidebar lg:sticky lg:top-32 bg-paper border border-black/10 rounded-xl p-6 space-y-6">
                                {/* Client */}
                                {project.client_name && (
                                    <div>
                                        <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-1">
                                            {t('portfolio.client')}
                                        </p>
                                        <p className="font-sans text-sm text-black">
                                            {project.client_name}
                                        </p>
                                    </div>
                                )}

                                {/* Type */}
                                <div>
                                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-1">
                                        {t('portfolio.type')}
                                    </p>
                                    <p className="font-sans text-sm text-black">
                                        {typeLabel}
                                    </p>
                                </div>

                                {/* Technologies */}
                                {project.technologies?.length > 0 && (
                                    <div>
                                        <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-2">
                                            {t('portfolio.technologies')}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="font-mono text-[10px] uppercase px-3 py-1 bg-black/5 text-black/60 rounded-full"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Year */}
                                {projectYear && (
                                    <div>
                                        <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-1">
                                            {t('portfolio.year')}
                                        </p>
                                        <p className="font-sans text-sm text-black">
                                            {projectYear}
                                        </p>
                                    </div>
                                )}

                                {/* External link */}
                                {project.content?.external_link && (
                                    <a
                                        href={project.content.external_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center font-mono text-xs uppercase tracking-widest px-4 py-3 bg-black text-white rounded-lg hover:bg-signal-red transition-colors duration-300"
                                    >
                                        Visit Project
                                    </a>
                                )}
                            </div>
                        </aside>
                    </div>
                </main>

                {/* ─── Next / Previous Project Navigation ─── */}
                <section className="pd-nav-section bg-black">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Previous */}
                        {prevProject ? (
                            <Link
                                to={`/portfolio/${prevProject.slug}`}
                                className="group relative h-64 md:h-80 overflow-hidden flex items-end p-8 md:p-10"
                            >
                                {prevProject.featured_image && (
                                    <img
                                        src={prevProject.featured_image}
                                        alt={prevProject.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="relative z-10">
                                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <ChevronLeft size={12} className="rtl:rotate-180" />
                                        {t('portfolio.prevProject')}
                                    </p>
                                    <p className="font-sans font-bold text-xl text-white group-hover:text-signal-red transition-colors duration-300">
                                        {prevProject.title}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                to="/#portfolio"
                                className="group relative h-64 md:h-80 overflow-hidden flex items-end p-8 md:p-10 bg-black/50"
                            >
                                <div className="relative z-10">
                                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <ChevronLeft size={12} className="rtl:rotate-180" />
                                        {t('portfolio.backToPortfolio')}
                                    </p>
                                    <p className="font-sans font-bold text-xl text-white group-hover:text-signal-red transition-colors duration-300">
                                        {t('portfolio.backToAll')}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* Next */}
                        {nextProject ? (
                            <Link
                                to={`/portfolio/${nextProject.slug}`}
                                className="group relative h-64 md:h-80 overflow-hidden flex items-end justify-end p-8 md:p-10 border-t md:border-t-0 md:border-l border-white/10"
                            >
                                {nextProject.featured_image && (
                                    <img
                                        src={nextProject.featured_image}
                                        alt={nextProject.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="relative z-10 text-right rtl:text-left">
                                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 flex items-center justify-end rtl:justify-start gap-2">
                                        {t('portfolio.nextProject')}
                                        <ChevronRight size={12} className="rtl:rotate-180" />
                                    </p>
                                    <p className="font-sans font-bold text-xl text-white group-hover:text-signal-red transition-colors duration-300">
                                        {nextProject.title}
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                to="/#portfolio"
                                className="group relative h-64 md:h-80 overflow-hidden flex items-end justify-end p-8 md:p-10 border-t md:border-t-0 md:border-l border-white/10 bg-black/50"
                            >
                                <div className="relative z-10 text-right rtl:text-left">
                                    <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2 flex items-center justify-end rtl:justify-start gap-2">
                                        {t('portfolio.backToPortfolio')}
                                        <ChevronRight size={12} className="rtl:rotate-180" />
                                    </p>
                                    <p className="font-sans font-bold text-xl text-white group-hover:text-signal-red transition-colors duration-300">
                                        {t('portfolio.backToAll')}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </section>
            </div>

            {/* ─── Lightbox ─── */}
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
