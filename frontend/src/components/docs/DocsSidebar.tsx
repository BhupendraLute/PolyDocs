import { FileText, Hash } from 'lucide-react';
import { type Document } from '../../types/docs';

interface DocsSidebarProps {
  docs: Document[];
  selectedDocId: string | undefined;
  onSelect: (doc: Document) => void;
}

export function DocsSidebar({ docs, selectedDocId, onSelect }: DocsSidebarProps) {
  return (
    <aside className="w-80 border-r border-white/5 bg-slate-900/40 backdrop-blur-2xl flex flex-col h-full flex-shrink-0">
      <div className="p-8 border-b border-white/5">
        <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Index</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
          {docs.length} Documents Detected
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`w-full text-left p-4 rounded-xl border transition-all group relative overflow-hidden font-bold text-sm ${
              selectedDocId === doc.id
                ? 'bg-gradient-to-r from-indigo-500/10 to-transparent border-indigo-500/20 text-indigo-400'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText
                className={`w-4 h-4 ${
                  selectedDocId === doc.id
                    ? 'text-indigo-400'
                    : 'text-slate-600 group-hover:text-slate-400'
                }`}
              />
              <span className="truncate">{doc.file_path.split('/').pop()}</span>
            </div>
            <div className="mt-2 flex justify-between items-center opacity-40 group-hover:opacity-60 transition-opacity">
              <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                <Hash className="w-3 h-3" /> {doc.commit_hash.substring(0, 5)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {doc.language}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
