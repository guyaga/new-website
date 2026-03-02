import { Link } from 'react-router-dom';

function estimateReadTime(content) {
  if (!content) return '3 min read';
  const words = content.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="bg-off-white rounded-2xl border border-black/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {post.coverImage && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <time className="font-mono text-xs text-black/40 uppercase">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span className="font-mono text-xs text-black/30">
              {estimateReadTime(post.rawContent)}
            </span>
          </div>
          <h3 className="font-sans font-bold text-lg tracking-tight mb-2 group-hover:text-signal-red transition-colors">
            {post.title}
          </h3>
          <p className="font-sans text-sm text-black/60 line-clamp-2">{post.excerpt}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-paper rounded-full text-black/50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
