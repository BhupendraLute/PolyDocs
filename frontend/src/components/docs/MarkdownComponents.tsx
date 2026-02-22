import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PreProps {
  children: React.ReactElement;
}

export const Pre = ({ children }: PreProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeContent = (children as any)?.props?.children || '';
    navigator.clipboard.writeText(String(codeContent));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group/code my-8">
      <button
        onClick={handleCopy}
        className={`absolute right-4 top-4 p-2 rounded-lg border transition-all z-20 
          ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-slate-400 opacity-0 group-hover/code:opacity-100 hover:bg-white/10'
          } backdrop-blur-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
      <pre className="!m-0 p-0 overflow-hidden rounded-[2rem] border border-white/5 bg-black/40">
        {children}
      </pre>
    </div>
  );
};

export const markdownComponents = {
  pre: Pre as any,
  code({ node, inline, className, children, ...props }: any) {
    return !inline ? (
      <code className={`${className} p-8 block text-sm leading-relaxed`} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="bg-white/5 text-indigo-300 px-1.5 py-0.5 rounded-md font-bold text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
  table({ children }: any) {
    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">{children}</table>
      </div>
    );
  },
  thead({ children }: any) {
    return (
      <thead className="bg-white/5 text-white font-black uppercase text-[10px] tracking-widest">
        {children}
      </thead>
    );
  },
  th({ children }: any) {
    return <th className="p-4 border-b border-white/5">{children}</th>;
  },
  td({ children }: any) {
    return <td className="p-4 border-b border-white/5 text-slate-400 text-sm">{children}</td>;
  },
};
