import { Github, BookOpen, Globe, Zap, Shield, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export function Landing() {
  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github/login`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="glow-1 absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="glow-2 absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PolyDocs
            </span>
          </div>
          <button
            onClick={handleLogin}
            className="px-5 py-2.5 bg-slate-50 text-slate-950 font-bold rounded-full hover:bg-white transition-all hover:scale-105 active:scale-95 text-sm"
          >
            Start for Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center hero-content animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Documentation Localization</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Global Docs. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Zero Effort.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Automate your documentation lifecycle. From code commits to localized, multi-language
            guides in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:-translate-y-1"
            >
              <Github className="w-6 h-6" />
              Sign in with GitHub
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 font-bold rounded-2xl transition-all">
              Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-400">Everything you need to globalize your tech docs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-indigo-400" />}
              title="Native Localization"
              description="Scale your reach with instant, high-quality translations for English, Spanish, French, and Japanese."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Webhook Automated"
              description="Simply push your code. PolyDocs detects changes and updates documentation automatically via GitHub Actions."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="Secure Storage"
              description="All documentation is stored securely in your Supabase instance, accessible via our premium dashboard."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-slate-500 text-sm">
        <p>&copy; 2026 PolyDocs. Built with Gemini AI & Lingo.dev</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/50 transition-all group cursor-default hover:-translate-y-2 duration-300">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
