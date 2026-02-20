import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../lib/api';

export interface Document {
  id: string;
  commit_hash: string;
  language: string;
  file_path: string;
  content: string;
  created_at: string;
}

export function DocsViewer() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDocs()
      .then((data: Document[]) => {
        setDocs(data);
        if (data.length > 0) {
          setSelectedDoc(data[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load documentation. Ensure Supabase is configured and reachable.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-slate-400 animate-pulse flex items-center gap-2 pr-4">
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"></div> Loading
        documentation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300">
        {error}
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-12 border border-slate-700 shadow-xl text-center">
        <h3 className="text-xl text-slate-300 font-semibold mb-2">No Documentation Found</h3>
        <p className="text-slate-500">Run a scan and compile to generate documentation.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl overflow-hidden min-h-[600px] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-700 bg-slate-900/30 overflow-y-auto max-h-[800px]">
        <div className="p-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur z-10">
          <h3 className="font-bold text-slate-200">Generated Files</h3>
          <p className="text-xs text-slate-500">{docs.length} documents available</p>
        </div>
        <div className="divide-y divide-slate-800/50">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`w-full text-left p-4 transition-all hover:bg-indigo-500/10 ${
                selectedDoc?.id === doc.id
                  ? 'bg-indigo-500/20 border-l-2 border-indigo-400'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <div className="text-sm font-mono text-slate-300 truncate mb-1" title={doc.file_path}>
                {doc.file_path.split('/').pop()}
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>{doc.commit_hash.substring(0, 7)}</span>
                <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor/Viewer Content */}
      <div className="w-2/3 p-8 overflow-y-auto max-h-[800px] bg-slate-900/10 prose prose-invert prose-indigo max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        {selectedDoc ? (
          <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            Select a document to view
          </div>
        )}
      </div>
    </div>
  );
}
