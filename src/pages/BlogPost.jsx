import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug } from '../utils/blog';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const [lang, setLang] = useState('en');

  if (!post) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen text-center">
        <h1 className="font-sans font-bold text-3xl mb-4">Post Not Found</h1>
        <Link to="/blog" className="font-mono text-sm text-signal-red hover:underline">
          &larr; Back to blog
        </Link>
      </main>
    );
  }

  const Component = post.Component;
  const title = lang === 'he' && post.titleHe ? post.titleHe : post.title;

  return (
    <>
      <Helmet>
        <title>{post.title} — Guy Aga</title>
        <meta name="description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>

      <main className="pt-32 pb-24 px-6 min-h-screen">
        <article className="max-w-prose mx-auto" dir={lang === 'he' ? 'rtl' : 'ltr'}>
          <div className="mb-8">
            <Link
              to="/blog"
              className="font-mono text-sm text-black/40 hover:text-signal-red transition-colors"
            >
              &larr; {lang === 'he' ? 'חזרה לבלוג' : 'Back to blog'}
            </Link>
          </div>

          {post.titleHe && (
            <div className="flex items-center gap-1 font-mono text-sm border border-black/10 rounded-full overflow-hidden w-fit mb-8">
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
          )}

          {post.coverImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={post.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <time className="font-mono text-xs text-black/40 uppercase">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-paper rounded-full text-black/50">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              {title}
            </h1>
          </header>

          <div className="prose prose-lg max-w-none
            prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:font-sans prose-p:text-black/80 prose-p:leading-relaxed
            prose-a:text-signal-red prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-black
            prose-code:bg-paper prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-blockquote:border-signal-red prose-blockquote:font-serif prose-blockquote:italic
            prose-li:font-sans prose-li:text-black/80
            prose-hr:border-black/10
          ">
            <Component />
          </div>
        </article>
      </main>
    </>
  );
}
