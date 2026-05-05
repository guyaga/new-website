import { useEffect, useState, useMemo } from 'react';
import { Star, Trash2, Copy, Check, ExternalLink, Download, ClipboardList, BarChart3, List } from 'lucide-react';
import { getAllSurveyResponses, deleteSurveyResponse, exportSurveyCsv } from '../../utils/survey';
import { getSessions } from '../../utils/course';
import SurveyDashboard from '../../components/admin/SurveyDashboard';

const SHARE_URL = 'https://bestguy.ai/course/10-days-10-skills/survey';

const TIME_LABEL = {
  lt1: '< 1 hour',
  '1to3': '1–3 hours',
  '3to10': '3–10 hours',
  '10plus': '10+ hours',
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SurveyAdmin() {
  const [items, setItems] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'list'

  const fetchAll = async () => {
    setLoading(true);
    const [data, sessions] = await Promise.all([getAllSurveyResponses(), getSessions()]);
    setItems(data);
    setLessons(sessions.filter((s) => (s.category || 'lesson') === 'lesson' && s.day >= 1 && s.day <= 10).sort((a, b) => a.day - b.day));
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const lessonByDay = useMemo(() => {
    const m = {};
    for (const l of lessons) m[l.day] = l;
    return m;
  }, [lessons]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this survey response permanently?')) return;
    try {
      await deleteSurveyResponse(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      showToast('Deleted');
    } catch (err) { showToast(err.message || 'Failed', 'error'); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const csv = exportSurveyCsv(items);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded');
  };

  return (
    <div className="p-8">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg font-sans text-sm ${
          toast.type === 'error' ? 'bg-signal-red text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>{toast.message}</div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Management</p>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-sans font-bold text-2xl tracking-tight">Survey Responses</h1>
            <span className="bg-signal-red/15 text-signal-red font-mono text-xs px-2.5 py-0.5 rounded-full border border-signal-red/30">
              {items.length} total
            </span>
          </div>
          <p className="font-sans text-sm text-white/40">
            Deep survey for the 10 Days 10 Skills course. Internal only.
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-signal-red/10 border border-signal-red/30 text-signal-red font-sans text-sm font-semibold hover:bg-signal-red/20 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy share link'}
            </button>
            <button
              onClick={handleExport}
              disabled={items.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 font-sans text-sm font-semibold hover:text-white disabled:opacity-30"
            >
              <Download size={14} /> CSV
            </button>
          </div>
          <a href={SHARE_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-white/30 hover:text-white/50 transition-colors">
            {SHARE_URL.replace('https://', '')} <ExternalLink size={9} className="inline" />
          </a>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setView('dashboard')}
          className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
            view === 'dashboard'
              ? 'bg-signal-red/10 border-signal-red/30 text-signal-red'
              : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
          }`}
        >
          <BarChart3 size={14} /> Dashboard
        </button>
        <button
          onClick={() => setView('list')}
          className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
            view === 'list'
              ? 'bg-signal-red/10 border-signal-red/30 text-signal-red'
              : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
          }`}
        >
          <List size={14} /> All responses ({items.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-32" />)}
        </div>
      ) : view === 'dashboard' ? (
        <SurveyDashboard responses={items} lessons={lessons} />
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <ClipboardList size={32} className="mx-auto text-white/20 mb-4" />
          <p className="font-sans text-white/40">No survey responses yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-sans font-semibold text-white">{r.name}</span>
                  <a href={`mailto:${r.email}`} className="font-mono text-xs text-white/40 hover:text-signal-red" dir="ltr">{r.email}</a>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">[{r.lang}]</span>
                </div>
                <span className="font-mono text-[10px] text-white/30 shrink-0">{formatDate(r.created_at)}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">NPS</p>
                  <p className={`font-sans font-bold text-xl ${npsColor(r.nps)}`}>{r.nps ?? '—'}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Rating</p>
                  <div className="flex items-center gap-0.5">
                    {r.overall_rating ? (
                      [1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} className={n <= r.overall_rating ? 'text-signal-red' : 'text-white/15'} fill={n <= r.overall_rating ? 'currentColor' : 'none'} />
                      ))
                    ) : <span className="font-sans text-white/40">—</span>}
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Time saved/wk</p>
                  <p className="font-sans text-sm text-white">{TIME_LABEL[r.weekly_time_saved] ?? '—'}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Needs depth</p>
                  <p className="font-sans text-sm text-white">{r.needs_depth_day ? `Day ${r.needs_depth_day} · ${(lessonByDay[r.needs_depth_day]?.name_en) ?? ''}` : '—'}</p>
                </div>
              </div>

              {r.top_useful_days && r.top_useful_days.length > 0 && (
                <div className="mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Most useful</p>
                  <div className="flex flex-wrap gap-2">
                    {r.top_useful_days.map((d) => (
                      <span key={d} className="px-2.5 py-1 rounded-full bg-signal-red/10 border border-signal-red/30 text-signal-red font-sans text-xs">
                        Day {d} · {lessonByDay[d]?.name_en ?? ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {r.what_built && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">What they built</p>
                  <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap">{r.what_built}</p>
                </div>
              )}
              {r.next_topic && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Next topic wanted</p>
                  <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap">{r.next_topic}</p>
                </div>
              )}
              {r.additional_comments && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Comments</p>
                  <p dir={r.lang === 'he' ? 'rtl' : 'ltr'} className="font-sans text-sm text-white/80 whitespace-pre-wrap">{r.additional_comments}</p>
                </div>
              )}

              <div className="flex items-center justify-end pt-3 border-t border-white/10">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 font-sans text-xs font-semibold hover:text-signal-red"
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
