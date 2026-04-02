import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Unlock, Send, Users, ExternalLink } from 'lucide-react';
import { getSessions, unlockSession, lockSession, sendUnlockEmail } from '../../utils/course';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CourseAdmin() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [confirmUnlock, setConfirmUnlock] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const data = await getSessions();
    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async (session) => {
    if (session.is_unlocked) {
      // Lock it
      try {
        const updated = await lockSession(session.id);
        setSessions((prev) => prev.map((s) => (s.id === session.id ? updated : s)));
        showToast(`Day ${session.day} locked`);
      } catch {
        showToast('Failed to lock session', 'error');
      }
    } else {
      // Confirm unlock
      setConfirmUnlock(session.id);
    }
  };

  const handleConfirmUnlock = async (session) => {
    setConfirmUnlock(null);
    try {
      const updated = await unlockSession(session.id);
      setSessions((prev) => prev.map((s) => (s.id === session.id ? updated : s)));
      showToast(`Day ${session.day} unlocked!`);
    } catch {
      showToast('Failed to unlock session', 'error');
    }
  };

  const handleSendEmail = async (session) => {
    setSending(session.id);
    try {
      const result = await sendUnlockEmail(session);
      showToast(`Email sent to ${result.sent} members`);
    } catch (err) {
      showToast(err.message || 'Failed to send email', 'error');
    } finally {
      setSending(null);
    }
  };

  const unlockedCount = sessions.filter((s) => s.is_unlocked).length;

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg font-sans text-sm ${
          toast.type === 'error' ? 'bg-signal-red text-white' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Management</p>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-sans font-bold text-2xl tracking-tight">Course Sessions</h1>
          <span className="bg-signal-red/20 text-signal-red font-mono text-xs px-2.5 py-0.5 rounded-full">
            {unlockedCount}/10 unlocked
          </span>
        </div>
        <Link
          to="/admin/course/members"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/40 hover:text-signal-red transition-colors"
        >
          <Users size={14} />
          Manage Members
        </Link>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Day badge */}
                <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold ${
                  session.is_unlocked ? 'bg-signal-red text-white' : 'bg-white/10 text-white/30'
                }`}>
                  {session.day}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-sans font-semibold text-sm text-white">{session.name_en}</span>
                    <span className="font-sans text-sm text-white/40">{session.name_he}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{session.service}</span>
                    {session.is_unlocked && (
                      <span className="font-mono text-[10px] text-emerald-400/60">
                        Unlocked {formatDate(session.unlocked_at)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-2">
                  {session.github_url && (
                    <a href={session.github_url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/50 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Send email button (only for unlocked) */}
                  {session.is_unlocked && (
                    <button
                      onClick={() => handleSendEmail(session)}
                      disabled={sending === session.id}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-white/40 hover:text-signal-red hover:bg-signal-red/10 transition-colors disabled:opacity-50"
                    >
                      <Send size={12} />
                      {sending === session.id ? 'Sending...' : 'Email'}
                    </button>
                  )}

                  {/* Toggle unlock/lock */}
                  {confirmUnlock === session.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white/40">Unlock & notify?</span>
                      <button
                        onClick={() => handleConfirmUnlock(session)}
                        className="font-mono text-xs text-signal-red hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmUnlock(null)}
                        className="font-mono text-xs text-white/40 hover:text-white/60"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggle(session)}
                      className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                        session.is_unlocked
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-white/10 hover:text-white/50'
                          : 'bg-white/5 text-white/30 hover:bg-signal-red/10 hover:text-signal-red'
                      }`}
                    >
                      {session.is_unlocked ? <Unlock size={12} /> : <Lock size={12} />}
                      {session.is_unlocked ? 'Unlocked' : 'Locked'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
