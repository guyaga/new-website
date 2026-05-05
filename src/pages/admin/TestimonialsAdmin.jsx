import { useEffect, useState } from 'react';
import { Star, Check, X, Sparkles, Trash2, Copy, ExternalLink, Filter } from 'lucide-react';
import {
  getAllTestimonials,
  updateTestimonialStatus,
  toggleTestimonialFeatured,
  deleteTestimonial,
} from '../../utils/testimonials';

const SHARE_URL = 'https://bestguy.ai/course/10-days-10-skills/feedback';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'featured', label: 'Featured' },
];

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-white/5 text-white/40 border-white/10',
  };
  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border rounded-full ${map[status] || map.rejected}`}>
      {status}
    </span>
  );
}

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const data = await getAllTestimonials();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = items.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'featured') return t.featured;
    return t.status === filter;
  });

  const counts = {
    all: items.length,
    pending: items.filter((t) => t.status === 'pending').length,
    approved: items.filter((t) => t.status === 'approved').length,
    rejected: items.filter((t) => t.status === 'rejected').length,
    featured: items.filter((t) => t.featured).length,
  };

  const handleStatus = async (id, status) => {
    try {
      const updated = await updateTestimonialStatus(id, status);
      setItems((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Marked ${status}`);
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    }
  };

  const handleFeature = async (t) => {
    try {
      const updated = await toggleTestimonialFeatured(t.id, !t.featured);
      setItems((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
      showToast(updated.featured ? 'Featured' : 'Unfeatured');
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial permanently?')) return;
    try {
      await deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      showToast('Deleted');
    } catch (err) {
      showToast(err.message || 'Failed', 'error');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg font-sans text-sm ${
          toast.type === 'error'
            ? 'bg-signal-red text-white'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Management</p>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-sans font-bold text-2xl tracking-tight">Testimonials</h1>
            {counts.pending > 0 && (
              <span className="bg-amber-500/15 text-amber-400 font-mono text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {counts.pending} pending
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-white/40">
            Internal collection from course members. Not displayed publicly.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-signal-red/10 border border-signal-red/30 text-signal-red font-sans text-sm font-semibold hover:bg-signal-red/20 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy share link'}
          </button>
          <a
            href={SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 font-mono text-[10px] text-white/30 hover:text-white/50 transition-colors"
          >
            {SHARE_URL.replace('https://', '')} <ExternalLink size={9} className="inline" />
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        <Filter size={14} className="text-white/30" />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
              filter === f.key
                ? 'bg-signal-red/10 border-signal-red/30 text-signal-red'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            {f.label} <span className="text-white/30 ml-1">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="font-sans text-white/40">No testimonials match this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`bg-white/5 border rounded-xl p-5 ${
                t.featured ? 'border-signal-red/30' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-sans font-semibold text-white">{t.name}</span>
                  {t.role && <span className="font-sans text-sm text-white/50">· {t.role}</span>}
                  {t.company && <span className="font-sans text-sm text-white/40">@ {t.company}</span>}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">[{t.lang}]</span>
                  <StatusBadge status={t.status} />
                  {t.featured && (
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-signal-red/30 bg-signal-red/15 text-signal-red rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-white/30 shrink-0">{formatDate(t.created_at)}</span>
              </div>

              {t.rating > 0 && (
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={14}
                      className={n <= t.rating ? 'text-signal-red' : 'text-white/15'}
                      fill={n <= t.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              )}

              <p
                dir={t.lang === 'he' ? 'rtl' : 'ltr'}
                className="font-sans text-white/80 leading-relaxed whitespace-pre-wrap mb-4"
              >
                {t.testimonial}
              </p>

              {t.improvement && (
                <div className="mb-4 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-amber-400/70 mb-1.5">
                    Improvement (private)
                  </p>
                  <p
                    dir={t.lang === 'he' ? 'rtl' : 'ltr'}
                    className="font-sans text-sm text-white/70 leading-relaxed whitespace-pre-wrap"
                  >
                    {t.improvement}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-4">
                <a href={`mailto:${t.email}`} className="hover:text-signal-red transition-colors" dir="ltr">
                  {t.email}
                </a>
                {t.linkedin_url && (
                  <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-signal-red transition-colors">
                    LinkedIn ↗
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {t.status !== 'approved' && (
                  <button
                    onClick={() => handleStatus(t.id, 'approved')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-sans text-xs font-semibold hover:bg-emerald-500/25"
                  >
                    <Check size={12} /> Approve
                  </button>
                )}
                {t.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatus(t.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 font-sans text-xs font-semibold hover:text-white"
                  >
                    <X size={12} /> Reject
                  </button>
                )}
                <button
                  onClick={() => handleFeature(t)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-sans text-xs font-semibold ${
                    t.featured
                      ? 'bg-signal-red/15 border-signal-red/30 text-signal-red'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Sparkles size={12} /> {t.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 font-sans text-xs font-semibold hover:text-signal-red ms-auto"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
