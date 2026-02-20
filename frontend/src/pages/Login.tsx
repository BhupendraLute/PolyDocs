import { Github } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export function Login() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    // Redirect to backend OAuth initiation
    window.location.href = 'http://localhost:3001/api/auth/github/login';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 cursor-default">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block mb-2">
            PolyDocs
          </h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            SaaS Edition
          </p>
        </div>

        <p className="text-lg text-slate-300 mb-8 font-medium">
          Sign in to connect your repositories and automate your documentation lifecycle.
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
        >
          <Github className="w-6 h-6" />
          Continue with GitHub
        </button>

        <p className="mt-8 text-slate-500 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
