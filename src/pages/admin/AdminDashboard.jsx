import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, FolderOpen, MessageSquare, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, drafts: 0, portfolio: 0, leads: 0, newLeads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [postsRes, portfolioRes, leadsRes] = await Promise.all([
        supabase.from('blog_posts').select('status'),
        supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
        supabase.from('contact_leads').select('status'),
      ]);

      const posts = postsRes.data || [];
      const leads = leadsRes.data || [];
      setStats({
        posts: posts.length,
        published: posts.filter((p) => p.status === 'published').length,
        drafts: posts.filter((p) => p.status === 'draft').length,
        portfolio: portfolioRes.count || 0,
        leads: leads.length,
        newLeads: leads.filter((l) => l.status === 'new').length,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Blog Posts', value: stats.posts, sub: `${stats.published} published, ${stats.drafts} drafts`, icon: FileText },
    { label: 'Portfolio Items', value: stats.portfolio, sub: 'Total projects', icon: FolderOpen },
    { label: 'Leads', value: stats.leads, sub: `${stats.newLeads} new`, icon: MessageSquare },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Overview</p>
        <h1 className="font-sans font-bold text-2xl tracking-tight">Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card) => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{card.label}</p>
                <card.icon size={18} className="text-white/20" />
              </div>
              <p className="font-sans font-bold text-4xl tracking-tight mb-1">{card.value}</p>
              <p className="font-mono text-xs text-white/30">{card.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Quick Actions</p>
        <div className="flex gap-4">
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-signal-red/90 transition-colors"
          >
            <Plus size={16} />
            New Blog Post
          </Link>
          <Link
            to="/admin/portfolio/new"
            className="inline-flex items-center gap-2 bg-white/10 text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-white/15 transition-colors"
          >
            <Plus size={16} />
            New Portfolio Item
          </Link>
        </div>
      </div>
    </div>
  );
}
