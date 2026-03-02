import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import BlogCard from '../components/BlogCard';
import { getAllPosts } from '../utils/blog';

export default function BlogList() {
  const [lang, setLang] = useState('en');
  const containerRef = useRef(null);
  const posts = getAllPosts();

  useEffect(() => {
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
  }, []);

  const localizedPosts = posts.map((post) => ({
    ...post,
    title: lang === 'he' && post.titleHe ? post.titleHe : post.title,
    excerpt: lang === 'he' && post.excerptHe ? post.excerptHe : post.excerpt,
  }));

  return (
    <>
      <Helmet>
        <title>Blog — Guy Aga</title>
        <meta name="description" content="Thoughts on AI strategy, digital products, education, and the future of creative work." />
      </Helmet>

      <main
        ref={containerRef}
        className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen"
        dir={lang === 'he' ? 'rtl' : 'ltr'}
      >
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">
              {lang === 'he' ? 'מהבלוג' : 'The Blog'}
            </p>
            <h1 className="font-sans font-bold text-4xl md:text-5xl tracking-tight uppercase">
              {lang === 'he' ? 'מחשבות' : 'Thoughts'}
            </h1>
          </div>

          <div className="flex items-center gap-1 font-mono text-sm border border-black/10 rounded-full overflow-hidden">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 transition-colors ${lang === 'en' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('he')}
              className={`px-4 py-1.5 transition-colors ${lang === 'he' ? 'bg-black text-white' : 'text-black/60 hover:text-black'}`}
            >
              עב
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {localizedPosts.map((post) => (
            <div key={post.slug} className="blog-list-card">
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="font-mono text-sm text-black/40 text-center py-20">No posts yet. Check back soon.</p>
        )}
      </main>
    </>
  );
}
