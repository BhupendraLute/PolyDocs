import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Outlet } from 'react-router-dom';
import type { Repository, Build } from '../types/dashboard';
import { Sidebar } from '../components/dashboard/Sidebar';
import { API_BASE_URL } from '../lib/api';

export function Dashboard() {
  const { token } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reposRes, buildsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/github/installations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/builds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!reposRes.ok) throw new Error('Failed to fetch repositories');
      if (!buildsRes.ok) throw new Error('Failed to fetch builds');

      const reposData = await reposRes.json();
      const buildsData = await buildsRes.json();

      setRepositories(reposData.repositories ?? []);
      setBuilds(buildsData.builds ?? []);
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [token]);

  const handleInstallApp = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/github/install-url`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch install URL');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error fetching install URL', err);
      setError('Could not retrieve the GitHub App installation URL. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500/30 flex overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <Outlet
            context={{
              repositories,
              builds,
              loading,
              error,
              fetchData,
              handleInstallApp,
            }}
          />
        </div>
      </main>
    </div>
  );
}
