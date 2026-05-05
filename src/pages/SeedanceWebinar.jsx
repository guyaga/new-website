import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Play, Zap, Globe, Cpu, LayoutGrid } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  {
    name: 'YouArt.ai',
    url: 'https://youart.ai/',
    description: 'Node-based visual workflow. Great for experimentation, slower generation speed.',
    tag: 'Visual Workflow',
    icon: Globe,
  },
  {
    name: 'Yapper.so',
    url: 'https://yapper.so',
    description: 'Solid all-around platform with clean UI. Occasionally slow under load.',
    tag: 'Recommended',
    icon: Zap,
  },
  {
    name: 'MuAPI',
    url: 'https://muapi.ai/playground/seedance-v2.0-i2v',
    description: 'UI + API access. Blazing fast generation, but higher cost per video.',
    tag: 'Fastest',
    icon: Cpu,
  },
  {
    name: 'PiAPI',
    url: 'https://piapi.ai/workspace/seedance',
    description: 'Fast and reliable with good pricing. Our top pick for the best balance of speed, cost, and results.',
    tag: 'Top Pick',
    icon: LayoutGrid,
    featured: true,
  },
];

export default function SeedanceWebinar() {
  const heroRef = useRef(null);
  const platformsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.webinar-hero-el', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.from('.platform-card', {
        scrollTrigger: {
          trigger: platformsRef.current,
          start: 'top 75%',
          invalidateOnRefresh: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.cta-el', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
          invalidateOnRefresh: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Seedance 2.0 Webinar — Guy Aga</title>
        <meta
          name="description"
          content="Watch the Seedance 2.0 workshop recording. Learn prompt techniques, explore platforms, and generate AI videos."
        />
      </Helmet>

      <div className="bg-black min-h-screen text-white">
        {/* ──── Hero ──── */}
        <div ref={heroRef} className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left: Info */}
            <div className="w-full lg:w-2/5 lg:sticky lg:top-32">
              <p className="webinar-hero-el font-mono text-xs text-signal-red uppercase tracking-widest mb-4">
                Workshop Recording
              </p>
              <h1 className="webinar-hero-el font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none mb-6">
                Seedance 2.0
                <br />
                <span className="text-white/40">Masterclass</span>
              </h1>
              <p className="webinar-hero-el font-sans text-base text-white/50 leading-relaxed mb-6 max-w-md">
                From prompt engineering to platform selection — everything you need to
                create stunning AI-generated videos with Seedance 2.0.
              </p>
              <div className="webinar-hero-el flex flex-wrap gap-3 mb-8">
                <span className="font-mono text-[11px] text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  March 25, 2026
                </span>
                <span className="font-mono text-[11px] text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  Zoom Workshop
                </span>
                <span className="font-mono text-[11px] text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  Guy Aga
                </span>
              </div>
            </div>

            {/* Right: Video */}
            <div className="w-full lg:w-3/5">
              <div className="webinar-hero-el relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                <iframe
                  src="https://www.youtube.com/embed/EOKP0DmiQd8"
                  title="Seedance 2.0 Webinar Recording"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ──── Platforms ──── */}
        <div
          ref={platformsRef}
          className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10"
        >
          <p className="font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
            Where to Generate
          </p>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-4">
            Platforms
          </h2>
          <p className="font-sans text-base text-white/40 max-w-xl mb-12">
            Four platforms to run Seedance 2.0 — each with different trade-offs
            in speed, price, and user experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {platforms.map((p) => {
              const Icon = p.icon;
              const isFeatured = p.featured;
              return (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`platform-card group flex gap-5 p-6 rounded-lg transition-all duration-300 ${
                    isFeatured
                      ? 'bg-white/10 border border-white/20 hover:border-white/30 hover:bg-white/[0.12]'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isFeatured
                      ? 'bg-white/10 border border-white/20 text-signal-red'
                      : 'bg-white/5 border border-white/10 text-white/40 group-hover:text-signal-red group-hover:border-signal-red/30'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-sans font-semibold transition-colors ${
                        isFeatured ? 'text-signal-red' : 'text-white group-hover:text-signal-red'
                      }`}>
                        {p.name}
                      </h3>
                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        isFeatured
                          ? 'text-signal-red bg-signal-red/10'
                          : 'text-white/30 bg-white/5'
                      }`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className={`font-sans text-sm leading-relaxed ${
                      isFeatured ? 'text-white/60' : 'text-white/40'
                    }`}>
                      {p.description}
                    </p>
                    <span className={`inline-flex items-center gap-1 font-mono text-xs mt-3 transition-colors ${
                      isFeatured ? 'text-signal-red/70 group-hover:text-signal-red' : 'text-white/30 group-hover:text-signal-red/70'
                    }`}>
                      Visit <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* ──── Prompt Hub CTA ──── */}
        <div
          ref={ctaRef}
          className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 md:p-12 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <p className="cta-el font-mono text-xs text-signal-red uppercase tracking-widest mb-3">
                Ready to Create?
              </p>
              <h2 className="cta-el font-serif text-3xl md:text-4xl tracking-tight mb-3">
                Browse 970+ Prompts
              </h2>
              <p className="cta-el font-sans text-base text-white/40 max-w-md">
                Explore our curated Seedance 2.0 prompt library with video previews.
                Search, copy, and start generating.
              </p>
            </div>
            <a
              href="/seedance"
              className="cta-el shrink-0 inline-flex items-center gap-2 font-mono text-sm bg-signal-red text-white px-8 py-4 rounded-full hover:bg-signal-red/80 transition-colors"
            >
              <Play className="w-4 h-4" fill="white" />
              Prompt Hub
            </a>
          </div>
        </div>

        {/* ──── Footer spacer ──── */}
        <div className="h-16" />
      </div>
    </>
  );
}
