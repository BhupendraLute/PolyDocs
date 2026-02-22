import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { LogOut, BookOpen, Settings, Plus, Github, RefreshCw } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  installation_id: number;
}

interface Build {
  id: string;
  repository_id: number;
  status: 'pending' | 'building' | 'success' | 'failed';
  commit_sha: string;
  author_name: string | null;
  commit_message: string | null;
  branch: string;
  created_at: string;
  pr_url?: string;
  repositories: {
    repo_full_name: string;
  };
}
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reposRes, buildsRes] = await Promise.all([
        fetch('http://localhost:3001/api/github/installations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:3001/api/builds', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!reposRes.ok) throw new Error('Failed to fetch repositories');
      if (!buildsRes.ok) throw new Error('Failed to fetch builds');

      const reposData = await reposRes.json();
      const buildsData = await buildsRes.json();

      setRepositories(reposData.repositories ?? []);
      setBuilds(buildsData.builds ?? []);
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [token]);

  const handleInstallApp = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/github/install-url', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch install URL');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error fetching install URL', err);
      setError('Could not retrieve the GitHub App installation URL. Please try again.');
    }
  };

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
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h1>
            <p className="text-lg text-slate-400">
              Manage your connected repositories and monitor documentation pipelines.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 2 - App Installation Stats */}
          <div className="col-span-1 md:col-span-2 bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                <Github className="w-6 h-6 text-slate-300" />
                Connected Repositories
              </h2>
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Install on Repository
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
                {error}
              </div>
            ) : repositories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400 font-medium text-lg">No repositories connected yet.</p>
                <p className="text-slate-500 text-sm mb-6">
                  Install the PolyDocs GitHub App to get started with auto-sync documentation.
                </p>
                <button
                  onClick={handleInstallApp}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-600"
                >
                  Connect your first repository
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <div>
                        <div className="font-semibold text-slate-200">{repo.full_name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {repo.private ? 'Private' : 'Public'} Repository &bull; Installation ID:{' '}
                          {repo.installation_id}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full cursor-default mt-1 border border-emerald-500/20">
                        Active
                      </span>
                      <button
                        onClick={() => navigate(`/docs/${repo.id}`)}
                        className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full border border-indigo-500/20 transition-colors flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        View Docs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-200">Recent Activity</h3>

              {builds.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No recent documentation builds. Push to your connected repository to trigger a
                  webhook!
                </p>
              ) : (
                <div className="space-y-4">
                  {builds.map((build) => (
                    <div key={build.id} className="border-l-2 border-slate-700 pl-4 py-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {build.status === 'success' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          )}
                          {build.status === 'failed' && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                          )}
                          {build.status === 'pending' || build.status === 'building' ? (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          ) : null}
                          <span className="text-sm font-medium text-slate-300 truncate max-w-[180px]">
                            {build.repositories?.repo_full_name}
                          </span>
                        </div>

                        {/* Phase 4: Show PR Link if available */}
                        {build.status === 'success' && build.pr_url && (
                          <a
                            href={build.pr_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 px-2 py-1 rounded transition-colors"
                          >
                            View PR
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate">
                        {build.commit_sha.substring(0, 7)} - {build.commit_message || 'No message'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(build.created_at).toLocaleTimeString()} ({build.status})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
