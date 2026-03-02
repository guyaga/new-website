import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogCard from './BlogCard';
import { getAllPosts } from '../utils/blog';

gsap.registerPlugin(ScrollTrigger);

export default function BlogPreview() {
  const containerRef = useRef(null);
  const posts = getAllPosts().slice(0, 3);

  useEffect(() => {
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
  }, []);

  if (posts.length === 0) return null;

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">From the Blog</p>
          <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-tight uppercase">Latest Thoughts</h2>
        </div>
        <Link
          to="/blog"
          className="hidden md:inline-flex items-center gap-2 font-mono text-sm text-black/60 hover:text-signal-red transition-colors"
        >
          View All Posts
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.slug} className="blog-preview-card">
            <BlogCard post={post} />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm text-black/60 hover:text-signal-red transition-colors"
        >
          View All Posts
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
