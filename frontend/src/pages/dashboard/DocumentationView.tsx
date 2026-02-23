import { useNavigate, useOutletContext } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { DashboardContextType } from '../../types/dashboard';

export function DocumentationView() {
  const { repositories } = useOutletContext<DashboardContextType>();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Library Hub</h1>
        <p className="text-slate-400 font-medium">
          Browse and manage all your automated documentation repositories.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="bg-slate-900/40 rounded-3xl border border-white/5 p-6 hover:border-indigo-500/30 transition-all animate-fade-in-up group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-black text-lg text-white mb-1">{repo.full_name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6 italic">
              {repo.private ? 'Private' : 'Public'} Node
            </p>
            <button
              onClick={() => navigate(`/docs/${repo.id}`)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all uppercase text-[10px] tracking-widest"
            >
              Browse Documents
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
