import type { ScanResult, GitFileChange } from '../types';

interface ScanResultCardProps {
  result: ScanResult;
}

const FileStatusIcon = ({ status }: { status: GitFileChange['status'] }) => {
  switch (status) {
    case 'A':
    case '?':
      return (
        <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold">
          ADDED
        </span>
      );
    case 'M':
      return (
        <span className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs font-bold">
          MODIFIED
        </span>
      );
    case 'D':
      return (
        <span className="text-rose-400 bg-rose-400/10 px-2 py-1 rounded text-xs font-bold">
          DELETED
        </span>
      );
    default:
      return (
        <span className="text-slate-400 bg-slate-400/10 px-2 py-1 rounded text-xs font-bold">
          {status}
        </span>
      );
  }
};

export function ScanResultCard({ result }: ScanResultCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-indigo-400">Scan Results</span>
          {result.compiled && (
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
              Docs Compiled
            </span>
          )}
        </h2>
        <span className="text-slate-400 text-sm font-mono">
          Commit: {result.commitHash.substring(0, 7)}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Total Changes</div>
          <div className="text-2xl font-bold text-white">{result.stats.total}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-emerald-400 mb-1">Added</div>
          <div className="text-2xl font-bold text-emerald-400">{result.stats.added}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-amber-400 mb-1">Modified</div>
          <div className="text-2xl font-bold text-amber-400">{result.stats.modified}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-rose-400 mb-1">Deleted</div>
          <div className="text-2xl font-bold text-rose-400">{result.stats.deleted}</div>
        </div>
      </div>

      <div className="space-y-2">
        {result.files.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No relevant file changes detected.</p>
        ) : (
          result.files.map((file) => (
            <div
              key={file.path}
              className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-700"
            >
              <span className="font-mono text-slate-300 truncate mr-4">{file.path}</span>
              <FileStatusIcon status={file.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
