import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ArrowLeft, Upload, Eye } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { supabase } from '../../lib/supabase';
import { slugify } from '../../utils/slug';

const EMPTY_POST = {
  title: '',
  slug: '',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  body: '',
  tags: [],
  cover_image: '',
  status: 'draft',
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [post, setPost] = useState(EMPTY_POST);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (!isNew) {
      supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            navigate('/admin/blog');
            return;
          }
          setPost(data);
          setAutoSlug(false);
          setLoading(false);
        });
    }
  }, [id, isNew, navigate]);

  const updateField = (field, value) => {
    setPost((p) => {
      const updated = { ...p, [field]: value };
      if (field === 'title' && autoSlug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSlugChange = (value) => {
    setAutoSlug(false);
    setPost((p) => ({ ...p, slug: slugify(value) }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim();
      if (!post.tags.includes(tag)) {
        setPost((p) => ({ ...p, tags: [...p.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setPost((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `covers/${post.slug || 'untitled'}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('blog').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('blog').getPublicUrl(path);
      setPost((p) => ({ ...p, cover_image: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSave = async (status) => {
    if (!post.title.trim() || !post.slug.trim()) {
      alert('Title and slug are required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      excerpt: post.excerpt,
      body: post.body,
      tags: post.tags,
      cover_image: post.cover_image,
      status: status || post.status,
    };

    let result;
    if (isNew) {
      result = await supabase.from('blog_posts').insert(payload).select().single();
    } else {
      result = await supabase.from('blog_posts').update(payload).eq('id', id).select().single();
    }

    setSaving(false);

    if (result.error) {
      alert(`Error: ${result.error.message}`);
      return;
    }

    if (isNew && result.data?.id) {
      navigate(`/admin/blog/${result.data.id}`, { replace: true });
    } else {
      setPost((p) => ({ ...p, status: status || p.status }));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post permanently?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    navigate('/admin/blog');
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
    <div className="p-8 max-w-6xl" data-color-mode="dark">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/blog')}
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
              {isNew ? 'New Post' : 'Edit Post'}
            </p>
            <h1 className="font-sans font-bold text-xl tracking-tight">
              {post.title || 'Untitled'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-white/50 hover:text-white font-mono text-sm transition-colors"
            >
              <Eye size={16} />
              Preview
            </a>
          )}
          {!isNew && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-white/40 hover:text-signal-red font-mono text-sm transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-white/10 text-white font-mono text-sm uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-white/15 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-signal-red text-white font-mono text-sm uppercase tracking-wider px-5 py-2.5 rounded-lg hover:bg-signal-red/90 disabled:opacity-50 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Markdown Editor */}
        <div className="space-y-6">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-lg
                focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Post title..."
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Body</label>
            <MDEditor
              value={post.body}
              onChange={(val) => updateField('body', val || '')}
              height={500}
              preview="live"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Status</label>
            <span className={`inline-block font-mono text-xs uppercase px-3 py-1 rounded-full ${
              post.status === 'published'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {post.status}
            </span>
          </div>

          {/* Slug */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Slug</label>
            <input
              type="text"
              value={post.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm
                focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="url-slug"
            />
          </div>

          {/* Date */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Date</label>
            <input
              type="date"
              value={post.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm
                focus:outline-none focus:border-signal-red/50 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Excerpt</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              rows={3}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-sans text-sm
                focus:outline-none focus:border-signal-red/50 transition-colors resize-none"
              placeholder="Brief description..."
            />
          </div>

          {/* Tags */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleRemoveTag(tag)}
                  className="font-mono text-[10px] uppercase px-2 py-0.5 bg-signal-red/10 text-signal-red rounded hover:bg-signal-red/20 transition-colors"
                >
                  {tag} &times;
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm
                focus:outline-none focus:border-signal-red/50 transition-colors"
              placeholder="Type tag + Enter"
            />
          </div>

          {/* Cover Image */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Cover Image</label>
            {post.cover_image && (
              <div className="mb-3 rounded-lg overflow-hidden aspect-[16/9]">
                <img src={post.cover_image} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm cursor-pointer transition-colors ${
              uploading ? 'bg-white/5 text-white/30' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
            }`}>
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {post.cover_image && (
              <button
                onClick={() => setPost((p) => ({ ...p, cover_image: '' }))}
                className="ml-2 font-mono text-[10px] text-white/30 hover:text-signal-red transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
