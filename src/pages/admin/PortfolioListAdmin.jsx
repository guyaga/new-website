import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function PortfolioListAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('portfolio_items')
      .select('id, title, slug, type, client_name, featured_image, sort_order')
      .order('sort_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This will also delete associated media.`)) return;
    await supabase.from('portfolio_media').delete().eq('portfolio_item_id', id);
    await supabase.from('portfolio_items').delete().eq('id', id);
    fetchItems();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Content</p>
          <h1 className="font-sans font-bold text-2xl tracking-tight">Portfolio</h1>
        </div>
        <Link
          to="/admin/portfolio/new"
          className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-signal-red/90 transition-colors"
        >
          <Plus size={16} />
          New Item
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-white/40 mb-4">No portfolio items yet</p>
          <Link
            to="/admin/portfolio/new"
            className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-3 rounded-lg"
          >
            <Plus size={16} />
            Create First Item
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Item</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Type</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Client</th>
                <th className="text-left font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Order</th>
                <th className="text-right font-mono text-[10px] text-white/40 uppercase tracking-widest px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.featured_image && (
                        <img src={item.featured_image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                      )}
                      <div>
                        <Link to={`/admin/portfolio/${item.id}`} className="font-sans text-sm text-white hover:text-signal-red transition-colors">
                          {item.title}
                        </Link>
                        <p className="font-mono text-[10px] text-white/30">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase text-white/50 bg-white/5 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/50">
                    {item.client_name || '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-white/50">
                    {item.sort_order}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/portfolio/${item.id}`}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 text-white/40 hover:text-signal-red transition-colors"
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
