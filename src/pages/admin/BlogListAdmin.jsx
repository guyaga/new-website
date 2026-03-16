import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function BlogListAdmin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, date, tags')
      .order('date', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Content</p>
          <h1 className="font-sans font-bold text-2xl tracking-tight">Blog Posts</h1>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-signal-red/90 transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-white/40 mb-4">No blog posts yet</p>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg"
          >
            <Plus size={16} />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Title</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Status</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Date</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Tags</th>
                <th className="text-right font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/blog/${post.id}`} className="font-sans text-sm text-white hover:text-signal-red transition-colors">
                      {post.title}
                    </Link>
                    <p className="font-mono text-[10px] text-white/30 mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
                      post.status === 'published'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/50">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="font-mono text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 text-white/40 hover:text-signal-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
