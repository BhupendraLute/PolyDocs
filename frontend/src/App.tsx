<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
=======
import { useState, useEffect } from 'react';
import { api } from './lib/api';
import type { ScanResult } from './types';
import { ScanResultCard } from './components/ScanResultCard';
import { DocsViewer } from './components/DocsViewer';

function App() {
  const [health, setHealth] = useState<{ status: string; timestamp: string } | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [compileDocs, setCompileDocs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scanner' | 'docs'>('scanner');

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('Error fetching health:', err));
  }, []);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setScanResult(null);
    try {
      const result = await api.triggerScan(compileDocs);
      setScanResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to scan repository. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 border-b border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PolyDocs
            </h1>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl">
              The next-generation platform for automatic documentation synchronization and
              multi-language localization.
            </p>
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'scanner' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Scanner Dashboard
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              Documentation Viewer
            </button>
          </div>
        </header>

        {activeTab === 'scanner' ? (
          <>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm transition-all hover:border-slate-600">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                  Backend Status
                </h2>
                {health ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400 font-semibold text-lg">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      System Online
                    </div>
                    <div className="text-slate-400">
                      <p className="text-sm font-medium uppercase tracking-wider">
                        Last Health Check
                      </p>
                      <p className="text-slate-200 mt-1">
                        {new Date(health.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    Connecting to node...
                  </div>
                )}
              </section>

              <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm transition-all hover:border-slate-600">
                <h2 className="text-2xl font-bold mb-6">PolyDocs Hub</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Synchronize your codebase with localized documentation using Lingo.dev. Versioned,
                  compiled, and ready for production.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="compile"
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0"
                      checked={compileDocs}
                      onChange={(e) => setCompileDocs(e.target.checked)}
                    />
                    <label
                      htmlFor="compile"
                      className="text-slate-300 font-medium select-none cursor-pointer"
                    >
                      Also Compile Documentation (Mock)
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleScan}
                      disabled={loading}
                      className={`px-6 py-3 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center min-w-[160px]
                        ${
                          loading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                        }`}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Scanning...
                        </span>
                      ) : (
                        'Scan Codebase'
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </section>
            </main>

            {scanResult && <ScanResultCard result={scanResult} />}
          </>
        ) : (
          <DocsViewer />
        )}

        <footer className="mt-20 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2026 PolyDocs Platform. Precision documentation by{' '}
            <span className="text-indigo-400 font-semibold">Lingo.dev</span>
          </p>
        </footer>
      </div>
    </div>
>>>>>>> main
  );
}

export default App;
