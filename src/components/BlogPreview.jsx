import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogCard from './BlogCard';
import { getAllPosts } from '../utils/blog';
import { useLanguage, createT } from '../i18n';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPreview() {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = createT(lang);

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || posts.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.blog-preview-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, posts.length]);

  if (!loading && posts.length === 0) return null;

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">{t('blogPreview.label')}</p>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase">{t('blogPreview.heading')}</h2>
        </div>
        <Link
          to="/blog"
          className="hidden md:inline-flex items-center gap-2 font-mono text-sm text-black/60 hover:text-signal-red transition-colors"
        >
          {t('blogPreview.viewAll')}
          <span aria-hidden="true" className="rtl:rotate-180 inline-block">&rarr;</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-off-white rounded-2xl border border-black/10 overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-paper" />
              <div className="p-6 space-y-3">
                <div className="h-3 bg-paper rounded w-1/3" />
                <div className="h-5 bg-paper rounded w-2/3" />
                <div className="h-3 bg-paper rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="blog-preview-card">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm text-black/60 hover:text-signal-red transition-colors"
        >
          {t('blogPreview.viewAll')}
          <span aria-hidden="true" className="rtl:rotate-180 inline-block">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
