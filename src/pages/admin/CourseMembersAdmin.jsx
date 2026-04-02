import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Users, Download, Pencil, Send, X, Check } from 'lucide-react';
import { getMembers, addMember, removeMember, updateMember, sendWelcomeEmail } from '../../utils/course';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CourseMembersAdmin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const data = await getMembers();
    setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const member = await addMember(name.trim(), email.trim().toLowerCase(), phone.trim());
      setMembers((prev) => [member, ...prev]);
      setName('');
      setEmail('');
      setPhone('');
      setShowForm(false);
      showToast(`${member.name} added`);
    } catch (err) {
      setError(err.message?.includes('duplicate') ? 'Email already exists' : 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirmId(null);
      showToast('Member removed');
    } catch {
      showToast('Failed to remove', 'error');
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPhone(member.phone || '');
    setDeleteConfirmId(null);
  };

  const handleSaveEdit = async (id) => {
    try {
      const updated = await updateMember(id, {
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim(),
      });
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setEditingId(null);
      showToast('Member updated');
    } catch (err) {
      showToast(err.message?.includes('duplicate') ? 'Email already exists' : 'Failed to update', 'error');
    }
  };

  const handleSendWelcome = async (member) => {
    setSendingId(member.id);
    try {
      await sendWelcomeEmail(member);
      showToast(`Welcome email sent to ${member.email}`);
    } catch (err) {
      showToast(err.message || 'Failed to send', 'error');
    } finally {
      setSendingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Joined'];
    const rows = members.map((m) => [
      m.name,
      m.email,
      m.phone || '',
      formatDate(m.created_at),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <Link
          to="/admin/course"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/40 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Sessions
        </Link>
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Management</p>
        <div className="flex items-center gap-3">
          <h1 className="font-sans font-bold text-2xl tracking-tight">Course Members</h1>
          <span className="bg-white/10 text-white/50 font-mono text-xs px-2.5 py-0.5 rounded-full">
            {members.length}
          </span>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3 mb-6">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full bg-white/5 text-white/40 hover:text-signal-red hover:bg-signal-red/10 transition-colors"
          >
            <UserPlus size={14} />
            Add Member
          </button>
        )}
        {members.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {/* Add member form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                placeholder="Member name"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                placeholder="+972-50-000-0000"
                dir="ltr"
              />
            </div>
          </div>

          {error && <p className="font-mono text-xs text-signal-red">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full bg-signal-red text-white hover:bg-signal-red/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(''); }}
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full text-white/40 hover:text-white/60 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Members list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-16" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20">
          <Users size={40} className="text-white/10 mx-auto mb-4" />
          <p className="font-sans text-white/30">No members yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const isEditing = editingId === member.id;
            const isConfirmingDelete = deleteConfirmId === member.id;
            const isSending = sendingId === member.id;

            return (
              <div
                key={member.id}
                className={`bg-white/5 border rounded-xl overflow-hidden transition-colors ${
                  isEditing ? 'border-signal-red/30' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isEditing ? (
                  /* Edit mode */
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Email</label>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-transparent border-b border-white/20 focus:border-signal-red py-2 font-sans text-sm text-white outline-none transition-colors"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(member.id)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full bg-signal-red text-white hover:bg-signal-red/80 transition-colors"
                      >
                        <Check size={12} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full text-white/40 hover:text-white/60 transition-colors"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-sans font-semibold text-sm text-white truncate">{member.name}</span>
                        <span className="font-mono text-xs text-white/30 truncate">{member.email}</span>
                        {member.phone && (
                          <span className="font-mono text-xs text-white/20 truncate">{member.phone}</span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-white/20 hidden md:block">
                      {formatDate(member.created_at)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Send welcome email */}
                      <button
                        onClick={() => handleSendWelcome(member)}
                        disabled={isSending}
                        title="Send course info email"
                        className="p-2 rounded-lg text-white/20 hover:text-signal-red hover:bg-signal-red/10 transition-colors disabled:opacity-50"
                      >
                        <Send size={14} className={isSending ? 'animate-pulse' : ''} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => startEdit(member)}
                        title="Edit member"
                        className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Delete */}
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-2 ms-2">
                          <span className="font-mono text-xs text-white/40">Delete?</span>
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="font-mono text-xs text-signal-red hover:underline"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="font-mono text-xs text-white/40 hover:text-white/60"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(member.id)}
                          title="Remove member"
                          className="p-2 rounded-lg text-white/20 hover:text-signal-red hover:bg-signal-red/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
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
