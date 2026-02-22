import { useNavigate, NavLink } from 'react-router-dom';
import { BookOpen, Activity, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}

function SidebarLink({ icon, label, to, end = false }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all cursor-pointer font-bold text-sm mb-1 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400'
            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-indigo-400' : 'text-slate-600'}>{icon}</span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="w-72 border-r border-white/5 bg-slate-900/40 backdrop-blur-2xl flex flex-col z-20">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">PolyDocs</span>
        </div>

        <nav className="space-y-1">
          <SidebarLink
            icon={<Activity className="w-4 h-4" />}
            label="Overview"
            to="/dashboard"
            end
          />
          <SidebarLink
            icon={<BookOpen className="w-4 h-4" />}
            label="Documentation"
            to="/dashboard/documentation"
          />
          <SidebarLink
            icon={<Settings className="w-4 h-4" />}
            label="Settings"
            to="/dashboard/settings"
          />
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5 bg-slate-950/20">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-rose-500/5 text-rose-400 font-bold hover:bg-rose-500/10 transition-all border border-rose-500/10 shadow-lg shadow-rose-500/5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
