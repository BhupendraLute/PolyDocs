import { useOutletContext } from 'react-router-dom';
import { Github } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import type { DashboardContextType } from '../../types/dashboard';

export function SettingsView() {
  const { repositories } = useOutletContext<DashboardContextType>();
  const { user, logout } = useAuth();

  return (
    <div className="stagger-item max-w-2xl">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account Control</h1>
        <p className="text-slate-400 font-medium">
          Configure your profile and integration settings.
        </p>
      </header>

      <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-xl mb-8 stagger-item">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black shadow-2xl">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{user?.username}</h2>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
              ID: {user?.githubId}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/20 border border-white/5">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">
              Connected Auth
            </h4>
            <p className="text-white font-bold flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/20 border border-white/5">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-2">
              Workspace Nodes
            </h4>
            <p className="text-white font-bold">{repositories.length} Repositories</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-500/20 hover:bg-rose-600 hover:-translate-y-1 uppercase tracking-widest text-xs"
          >
            Terminate Session & Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
