import { useState, useEffect } from 'react';

function App() {
  const [health, setHealth] = useState<{
    status: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('Error fetching health:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PolyDocs
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl">
            The next-generation platform for automatic documentation synchronization and
            multi-language localization.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backend Status Card */}
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
                  <p className="text-sm font-medium uppercase tracking-wider">Last Health Check</p>
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

          {/* Quick Actions Card */}
          <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm transition-all hover:border-slate-600">
            <h2 className="text-2xl font-bold mb-6">PolyDocs Hub</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Synchronize your codebase with localized documentation using Lingo.dev. Versioned,
              compiled, and ready for production.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
                View Versions
              </button>
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all border border-slate-600 active:scale-95">
                Scan Codebase
              </button>
            </div>
          </section>
        </main>

        <footer className="mt-20 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2026 PolyDocs Platform. Developed by{' '}
            <span className="text-indigo-400 font-semibold">Bhupendra Lute</span> with ❤️
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
