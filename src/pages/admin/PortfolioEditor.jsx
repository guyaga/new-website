import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../utils/slug';

const EMPTY_ITEM = {
  title: '',
  slug: '',
  type: 'single_image',
  client_name: '',
  short_description: '',
  long_description: '',
  featured_image: '',
  technologies: [],
  categories: [],
  content: {},
  sort_order: 0,
};

export default function PortfolioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [item, setItem] = useState(EMPTY_ITEM);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [techInput, setTechInput] = useState('');
  const [catInput, setCatInput] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState('image');

  useEffect(() => {
    if (!isNew) {
      Promise.all([
        supabase.from('portfolio_items').select('*').eq('id', id).single(),
        supabase.from('portfolio_media').select('*').eq('portfolio_item_id', id).order('sort_order'),
      ]).then(([itemRes, mediaRes]) => {
        if (itemRes.error || !itemRes.data) {
          navigate('/admin/portfolio');
          return;
        }
        setItem(itemRes.data);
        setMedia(mediaRes.data || []);
        setAutoSlug(false);
        setLoading(false);
      });
    }
  }, [id, isNew, navigate]);

  const updateField = (field, value) => {
    setItem((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && autoSlug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleFeaturedUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `featured/${item.slug || 'item'}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(path);
      setItem((prev) => ({ ...prev, featured_image: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleAddMedia = async () => {
    if (!newMediaUrl.trim() || isNew) return;
    const { data, error } = await supabase.from('portfolio_media').insert({
      portfolio_item_id: id,
      media_type: newMediaType,
      media_url: newMediaUrl.trim(),
      sort_order: media.length,
    }).select().single();
    if (!error && data) {
      setMedia((prev) => [...prev, data]);
      setNewMediaUrl('');
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || isNew) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `media/${item.slug || 'item'}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('portfolio').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('portfolio').getPublicUrl(path);
      const { data, error: insertError } = await supabase.from('portfolio_media').insert({
        portfolio_item_id: id,
        media_type: 'image',
        media_url: urlData.publicUrl,
        sort_order: media.length,
      }).select().single();
      if (!insertError && data) {
        setMedia((prev) => [...prev, data]);
      }
    }
    setUploading(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    await supabase.from('portfolio_media').delete().eq('id', mediaId);
    setMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleSave = async () => {
    if (!item.title.trim() || !item.slug.trim()) {
      alert('Title and slug are required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: item.title,
      slug: item.slug,
      type: item.type,
      client_name: item.client_name,
      short_description: item.short_description,
      long_description: item.long_description,
      featured_image: item.featured_image,
      technologies: item.technologies,
      categories: item.categories,
      content: item.content,
      sort_order: item.sort_order,
    };

    let result;
    if (isNew) {
      result = await supabase.from('portfolio_items').insert(payload).select().single();
    } else {
      result = await supabase.from('portfolio_items').update(payload).eq('id', id).select().single();
    }

    setSaving(false);
    if (result.error) {
      alert(`Error: ${result.error.message}`);
      return;
    }
    if (isNew && result.data?.id) {
      navigate(`/admin/portfolio/${result.data.id}`, { replace: true });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this portfolio item permanently?')) return;
    await supabase.from('portfolio_media').delete().eq('portfolio_item_id', id);
    await supabase.from('portfolio_items').delete().eq('id', id);
    navigate('/admin/portfolio');
  };

  const handleAddArrayItem = (field, value, setter) => {
    if (!value.trim()) return;
    if (!item[field]?.includes(value.trim())) {
      setItem((prev) => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
    }
    setter('');
  };

  const handleRemoveArrayItem = (field, val) => {
    setItem((prev) => ({ ...prev, [field]: (prev[field] || []).filter((v) => v !== val) }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/portfolio')} className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
              {isNew ? 'New Item' : 'Edit Item'}
            </p>
            <h1 className="font-sans font-bold text-xl tracking-tight">{item.title || 'Untitled'}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 text-white/40 hover:text-signal-red font-mono text-sm transition-colors">
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-signal-red/90 disabled:opacity-50 transition-colors"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main */}
        <div className="space-y-6">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-lg focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Project title..."
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Short Description</label>
            <textarea
              value={item.short_description || ''}
              onChange={(e) => updateField('short_description', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-signal-red/50 transition-colors resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Long Description</label>
            <textarea
              value={item.long_description || ''}
              onChange={(e) => updateField('long_description', e.target.value)}
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-signal-red/50 transition-colors resize-none"
              placeholder="Detailed project description..."
            />
          </div>

          {/* Media section (only for saved items) */}
          {!isNew && (
            <div>
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">Media ({media.length})</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {media.map((m) => (
                  <div key={m.id} className="relative group bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    {m.media_type === 'image' ? (
                      <img src={m.media_url} alt="" className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center bg-white/5">
                        <span className="font-mono text-[10px] text-white/40 uppercase">{m.media_type}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteMedia(m.id)}
                      className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white/60 hover:text-signal-red opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    <p className="p-2 font-mono text-[9px] text-white/30 truncate">{m.media_type}</p>
                  </div>
                ))}
              </div>

              {/* Add media */}
              <div className="flex gap-2 mb-2">
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="instagram">Instagram</option>
                </select>
                <input
                  type="text"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
                  placeholder="Paste URL..."
                />
                <button onClick={handleAddMedia} className="px-4 py-2 bg-white/10 text-white rounded-lg font-mono text-sm hover:bg-white/15 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm cursor-pointer transition-colors ${uploading ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'}`}>
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleMediaUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Slug</label>
            <input
              type="text"
              value={item.slug}
              onChange={(e) => { setAutoSlug(false); setItem((p) => ({ ...p, slug: slugify(e.target.value) })); }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Type</label>
            <select
              value={item.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
            >
              <option value="single_image">Single Image</option>
              <option value="gallery">Gallery</option>
              <option value="video">Video</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Client Name</label>
            <input
              type="text"
              value={item.client_name || ''}
              onChange={(e) => updateField('client_name', e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Client..."
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Sort Order</label>
            <input
              type="number"
              value={item.sort_order || 0}
              onChange={(e) => updateField('sort_order', parseInt(e.target.value) || 0)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Technologies</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(item.technologies || []).map((t) => (
                <button key={t} onClick={() => handleRemoveArrayItem('technologies', t)} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-signal-red/10 text-signal-red rounded hover:bg-signal-red/20 transition-colors">
                  {t} &times;
                </button>
              ))}
            </div>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('technologies', techInput, setTechInput))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Type + Enter"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Categories</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(item.categories || []).map((c) => (
                <button key={c} onClick={() => handleRemoveArrayItem('categories', c)} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-signal-red/10 text-signal-red rounded hover:bg-signal-red/20 transition-colors">
                  {c} &times;
                </button>
              ))}
            </div>
            <input
              type="text"
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('categories', catInput, setCatInput))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Type + Enter"
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Featured Image</label>
            {item.featured_image && (
              <div className="mb-3 rounded-lg overflow-hidden aspect-[4/3]">
                <img src={item.featured_image} alt="Featured" className="w-full h-full object-cover" />
              </div>
            )}
            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm cursor-pointer transition-colors ${uploading ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'}`}>
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" disabled={uploading} />
            </label>
            {item.featured_image && (
              <button onClick={() => setItem((p) => ({ ...p, featured_image: '' }))} className="ml-2 font-mono text-[10px] text-white/30 hover:text-signal-red transition-colors">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
