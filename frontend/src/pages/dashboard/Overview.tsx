import { useNavigate, useOutletContext } from 'react-router-dom';
import { RefreshCw, Github, Plus, BookOpen, Zap, Activity, ExternalLink } from 'lucide-react';
import type { DashboardContextType } from '../../types/dashboard';

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
};

export function Overview() {
  const { repositories, builds, loading, error, fetchData, handleInstallApp } =
    useOutletContext<DashboardContextType>();
  const navigate = useNavigate();

  const filteredBuilds = builds.filter((build) =>
    repositories.some((repo) => repo.id === build.repository_id)
  );

  return (
    <>
      <header className="mb-10 flex justify-between items-center p-8 rounded-[2rem] bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/5 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] stagger-item">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
              Production
            </span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              v1.2.0
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white select-none">Dashboard</h1>
          <p className="text-slate-400 font-medium">Monitoring your documentation heartbeat.</p>
        </div>
        <button
          onClick={fetchData}
          className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95 shadow-xl"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <Github className="w-5 h-5 text-indigo-500" />
                Library Nodes
              </h2>
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-black rounded-xl transition-all hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 text-xs uppercase"
              >
                <Plus className="w-4 h-4" />
                Connect Repo
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24 bg-slate-900/30 rounded-[2rem] border border-white/5">
                <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-2xl text-center">
                <p className="font-bold">{error}</p>
              </div>
            ) : repositories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 rounded-[2rem] border border-dashed border-white/10 group">
                <BookOpen className="w-16 h-16 text-slate-700 mb-6 group-hover:text-indigo-500 transition-colors" />
                <p className="text-slate-400 font-bold text-xl mb-4">No active nodes detected</p>
                <button
                  onClick={handleInstallApp}
                  className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-2xl hover:bg-indigo-500 hover:-translate-y-1"
                >
                  Initialize Webhook
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {repositories.slice(0, 3).map((repo) => (
                  <div
                    key={repo.id}
                    className="stagger-item group flex items-center justify-between p-7 bg-slate-900/40 rounded-[1.5rem] border border-white/5 hover:border-indigo-500/40 transition-all hover:bg-slate-900/80 shadow-lg"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform border border-white/5 shadow-inner">
                        <BookOpen className="w-7 h-7 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-black text-lg text-white mb-0.5 group-hover:text-indigo-300 transition-colors">
                          {repo.full_name}
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                          SECURE NODE • {repo.private ? 'PRIVATE' : 'OPEN'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => navigate(`/docs/${repo.id}`)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-tighter rounded-xl transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                      >
                        Read Docs
                      </button>
                    </div>
                  </div>
                ))}
                {repositories.length > 3 && (
                  <button
                    onClick={() => navigate('documentation')}
                    className="w-full py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-indigo-400 transition-colors"
                  >
                    View All {repositories.length} Nodes →
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          <section className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-2xl rounded-[2rem] border border-white/5 p-8 h-full shadow-2xl relative overflow-hidden stagger-item">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-black mb-10 text-white flex items-center gap-3 uppercase tracking-wider">
              <Zap className="w-5 h-5 text-indigo-400" />
              Terminal
            </h3>

            {filteredBuilds.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <RefreshCw className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Awaiting Signal...
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredBuilds.slice(0, 5).map((build) => (
                  <div
                    key={build.id}
                    className="stagger-item relative pr-4 pb-8 border-l-2 border-slate-800 last:pb-0 ml-4"
                  >
                    <div
                      className={`absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full ${
                        build.status === 'success'
                          ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]'
                          : build.status === 'failed'
                            ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
                            : 'bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]'
                      }`}
                    />
                    <div className="flex items-center justify-between mb-2 pl-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-100 truncate uppercase tracking-tighter">
                          {build.repositories?.repo_full_name.split('/')[1]}
                        </span>
                        <span
                          className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                            build.status === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : build.status === 'failed'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}
                        >
                          {build.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {formatRelativeTime(build.created_at)}
                      </span>
                    </div>
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed ml-4 group/log relative">
                      <div className="text-slate-300 pr-8">
                        <span className="text-slate-500">{build.commit_sha.slice(0, 7)}</span> -{' '}
                        {build.commit_message || 'No message'}
                      </div>
                      {build.pr_url && (
                        <a
                          href={build.pr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-3 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-md transition-all border border-indigo-500/20"
                          title="View Pull Request"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
