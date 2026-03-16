import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const STATUS_OPTIONS = ['new', 'read', 'replied', 'archived'];
const FILTER_TABS = ['all', ...STATUS_OPTIONS];

const statusStyles = {
  new: 'bg-signal-red/20 text-signal-red',
  read: 'bg-white/20 text-white/70',
  replied: 'bg-emerald-500/20 text-emerald-400',
  archived: 'bg-white/10 text-white/30',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const newCount = leads.filter((l) => l.status === 'new').length;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setLeads(data);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('contact_leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l))
      );
    }
  };

  const deleteLead = async (id) => {
    const { error } = await supabase.from('contact_leads').delete().eq('id', id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setDeleteConfirmId(null);
      if (expandedId === id) setExpandedId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Management</p>
        <div className="flex items-center gap-3">
          <h1 className="font-sans font-bold text-2xl tracking-tight">Leads</h1>
          {newCount > 0 && (
            <span className="bg-signal-red text-white font-mono text-xs px-2.5 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-1.5 rounded-full transition-colors ${
              filter === tab
                ? 'bg-signal-red text-white'
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare size={40} className="text-white/10 mx-auto mb-4" />
          <p className="font-sans text-white/30">No leads found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isConfirmingDelete = deleteConfirmId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-white/20"
              >
                {/* Row summary */}
                <button
                  onClick={() => toggleExpand(lead.id)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-sans font-semibold text-sm text-white truncate">{lead.name}</span>
                      <span className="font-mono text-xs text-white/30 truncate">{lead.email}</span>
                    </div>
                    <p className="font-sans text-sm text-white/40 truncate">{lead.message}</p>
                  </div>
                  <span
                    className={`shrink-0 font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${statusStyles[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-white/20 w-24 text-right">
                    {formatDate(lead.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="shrink-0 text-white/30" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-white/30" />
                  )}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-5 space-y-4">
                    {/* Full message */}
                    <div>
                      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Message</p>
                      <p className="font-sans text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                        {lead.message}
                      </p>
                    </div>

                    {/* Contact info */}
                    <div className="flex gap-6">
                      <div>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Email</p>
                        <a
                          href={`mailto:${lead.email}`}
                          className="font-sans text-sm text-signal-red hover:underline"
                        >
                          {lead.email}
                        </a>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">Received</p>
                        <p className="font-sans text-sm text-white/50">{formatDate(lead.created_at)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mr-2">Status</p>
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(lead.id, s)}
                          className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                            lead.status === s
                              ? statusStyles[s]
                              : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}

                      <div className="ml-auto">
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white/40">Delete?</span>
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="font-mono text-xs text-signal-red hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="font-mono text-xs text-white/40 hover:text-white/60"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="text-white/20 hover:text-signal-red transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
