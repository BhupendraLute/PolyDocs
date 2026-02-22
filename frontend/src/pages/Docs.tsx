import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, LifeBuoy } from 'lucide-react';
import { DocsViewer } from '../components/DocsViewer';

export function Docs() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500/30 flex flex-col overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl px-8 h-20 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-sm"
          >
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </button>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-200">
              Localization Node #{repoId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
              EN
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-purple-500 flex items-center justify-center text-[10px] font-bold">
              ES
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-pink-500 flex items-center justify-center text-[10px] font-bold">
              FR
            </div>
          </div>
          <button className="ml-4 p-2 text-slate-500 hover:text-white transition-colors">
            <LifeBuoy className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex relative z-10">
        {repoId ? (
          <DocsViewer repositoryId={repoId} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full p-8 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-3xl text-center backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-2">Invalid Node Signal</h2>
              <p className="opacity-70">
                The repository identifier provided is invalid or disconnected.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
