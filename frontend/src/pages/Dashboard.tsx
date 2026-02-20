import { useAuth } from '../auth/AuthContext';
import { LogOut, BookOpen, Settings } from 'lucide-react';

export function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                PolyDocs
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h1>
          <p className="text-lg text-slate-400">
            Manage your connected repositories and monitor documentation pipelines.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder for Phase 2 - App Installation Stats */}
          <div className="col-span-1 md:col-span-2 bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Connected Repositories
            </h2>
            <div className="flex flex-col items-center justify-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
              <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium text-lg">No repositories connected yet.</p>
              <p className="text-slate-500 text-sm mb-6">
                Install the PolyDocs GitHub App to get started.
              </p>
              {/* Phase 2 target */}
              <button
                disabled
                className="px-6 py-3 bg-indigo-600/50 text-indigo-200 font-medium rounded-xl cursor-not-allowed"
              >
                Install GitHub App (Coming Soon)
              </button>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-200">Recent Activity</h3>
              <p className="text-sm text-slate-500 italic">No recent documentation builds.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
