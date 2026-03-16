import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import BlogCard from '../components/BlogCard';
import { getAllPosts } from '../utils/blog';
import { useLanguage, createT } from '../i18n';

export default function BlogList() {
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = createT(lang);

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || posts.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.blog-list-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, posts.length]);

  return (
    <>
      <Helmet>
        <title>{t('blog.pageTitle')}</title>
        <meta name="description" content="Thoughts on AI strategy, digital products, education, and the future of creative work." />
      </Helmet>

      <main
        ref={containerRef}
        className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen"
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
              {t('blog.label')}
            </p>
            <h1 className="font-sans font-bold text-4xl md:text-5xl tracking-tight uppercase">
              {t('blog.heading')}
            </h1>
          </div>
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
              <div key={post.slug} className="blog-list-card">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="font-mono text-sm text-black/40 text-center py-20">No posts yet. Check back soon.</p>
        )}
      </main>
    </>
  );
}
