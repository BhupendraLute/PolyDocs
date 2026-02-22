import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { DocsViewer } from '../components/DocsViewer';

export function Docs() {
  const { repoId } = useParams<{ repoId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span className="font-bold tracking-tight text-white flex items-center gap-2">
                Documentation Viewer
              </span>
            </div>
            <div className="w-[140px]">{/* Empty spacer for flex layout balance */}</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Repository Documentation</h1>
          <p className="text-slate-400">
            View the automated localized markdown for Repository #{repoId}.
          </p>
        </header>

        {repoId ? (
          <DocsViewer repositoryId={repoId} />
        ) : (
          <div className="p-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            Invalid Repository ID provided.
          </div>
        )}
      </main>
    </div>
  );
}
