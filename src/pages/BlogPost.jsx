import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blog';
import { useLanguage, createT } from '../i18n';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-xl overflow-hidden my-6">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a0a] border-b border-white/5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">{language}</span>
        </div>
      )}
      <pre className="!bg-[#111111] !p-5 !m-0 overflow-x-auto">
        <code className="!bg-transparent !p-0 !text-[#b0b0b0] text-sm font-mono leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} className="text-white/40" />
        )}
      </button>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();
  const t = createT(lang);

  useEffect(() => {
    getPostBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-32 pb-24 px-6 min-h-screen">
        <div className="max-w-prose mx-auto animate-pulse space-y-6">
          <div className="h-4 bg-paper rounded w-24" />
          <div className="aspect-[16/9] bg-paper rounded-2xl" />
          <div className="h-8 bg-paper rounded w-2/3" />
          <div className="space-y-3">
            <div className="h-4 bg-paper rounded" />
            <div className="h-4 bg-paper rounded w-5/6" />
            <div className="h-4 bg-paper rounded w-4/6" />
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-3xl mx-auto min-h-screen text-center">
        <h1 className="font-sans font-bold text-3xl mb-4">Post Not Found</h1>
        <Link to="/blog" className="font-mono text-sm text-signal-red hover:underline">
          &larr; {t('blog.backToBlog')}
        </Link>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} — Guy Aga</title>
        <meta name="description" content={post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <main className="pt-32 pb-24 px-6 min-h-screen">
        <article className="max-w-prose mx-auto">
          <div className="mb-8">
            <Link
              to="/blog"
              className="font-mono text-sm text-black/40 hover:text-signal-red transition-colors inline-flex items-center gap-1"
            >
              <span className="rtl:rotate-180">&larr;</span> {t('blog.backToBlog')}
            </Link>
          </div>

          {post.cover_image && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={post.cover_image}
                alt={post.title}
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
              {post.tags?.map((tag) => (
                <span key={tag} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-paper rounded-full text-black/50">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              {post.title}
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
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre({ children }) {
                  // Extract code element props from the pre > code structure
                  const codeEl = children?.props;
                  if (codeEl) {
                    return (
                      <CodeBlock className={codeEl.className}>
                        {codeEl.children}
                      </CodeBlock>
                    );
                  }
                  return <pre>{children}</pre>;
                },
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
}
