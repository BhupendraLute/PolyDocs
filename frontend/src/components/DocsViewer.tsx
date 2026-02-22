import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import { Clock, Activity } from 'lucide-react';
import { type Document } from '../types/docs';
import { DocsSidebar } from './docs/DocsSidebar';
import { markdownComponents } from './docs/MarkdownComponents';

export function DocsViewer({ repositoryId }: { repositoryId: string | number }) {
  const { token } = useAuth();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    api
      .getDocs(repositoryId, token)
      .then((data: { documents: Document[] }) => {
        setDocs(data.documents);
        if (data.documents.length > 0) {
          setSelectedDoc(data.documents[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Signal lost. Unable to retrieve local documentation cache.');
      })
      .finally(() => setLoading(false));
  }, [repositoryId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 rounded-[2rem] border border-white/5 backdrop-blur-xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        </div>
        <p className="mt-8 text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Decrypting Signal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] text-center backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4">
        <p className="text-rose-400 font-bold text-lg mb-2">Internal Error Occurred</p>
        <p className="text-rose-500/60 text-sm">{error}</p>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="bg-slate-950/50 rounded-[2.5rem] p-20 border border-white/5 shadow-2xl text-center backdrop-blur-3xl animate-in fade-in zoom-in-95">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
          <Activity className="w-10 h-10 text-slate-700" />
        </div>
        <h3 className="text-2xl text-white font-black mb-4 uppercase tracking-tight">
          Empty Memory Core
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
          No documentation has been compiled for this repository yet. Push a commit to trigger
          generation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <DocsSidebar docs={docs} selectedDocId={selectedDoc?.id} onSelect={setSelectedDoc} />

      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar bg-slate-950/20">
        <div className="max-w-4xl mx-auto px-10 py-16">
          {selectedDoc ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-12 flex items-center justify-between p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Clock className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight uppercase">
                      {selectedDoc.file_path.split('/').pop()}
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      Compiled • {new Date(selectedDoc.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                    {selectedDoc.language}
                  </span>
                </div>
              </header>

              <div
                className="prose prose-invert prose-indigo max-w-none 
                  prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                  prose-h1:text-5xl prose-h1:mb-12 prose-h1:pb-4 prose-h1:border-b prose-h1:border-white/5
                  prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-indigo-400
                  prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg mb-8
                  prose-hr:border-white/5 prose-hr:my-16
                  prose-ul:my-8 prose-li:my-2 prose-li:text-slate-400
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500/50 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                  prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                  prose-strong:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 transition-colors"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {selectedDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-600 gap-6 opacity-30">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                <Activity className="w-10 h-10" />
              </div>
              <span className="font-black uppercase tracking-[0.4em] text-xs">
                Awaiting Node Path Selection
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
