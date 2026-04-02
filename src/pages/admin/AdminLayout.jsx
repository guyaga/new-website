import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, MessageSquare, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/blog', icon: FileText, label: 'Blog' },
  { to: '/admin/portfolio', icon: FolderOpen, label: 'Portfolio' },
  { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
  { to: '/admin/course', icon: GraduationCap, label: 'Course' },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    async function fetchNewLeads() {
      const { count, error } = await supabase
        .from('contact_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');
      if (!error && count != null) setNewLeadsCount(count);
    }
    fetchNewLeads();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/10 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors ${
                  isActive
                    ? 'bg-signal-red/10 text-signal-red'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
              {item.label === 'Leads' && newLeadsCount > 0 && (
                <span className="ml-auto bg-signal-red text-white font-mono text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
                  {newLeadsCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
