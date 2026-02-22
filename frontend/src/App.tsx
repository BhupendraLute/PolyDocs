import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Overview } from './pages/dashboard/Overview';
import { DocumentationView } from './pages/dashboard/DocumentationView';
import { SettingsView } from './pages/dashboard/SettingsView';
import { Docs } from './pages/Docs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

import { Landing } from './pages/Landing';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Dashboard nested routes */}
          <Route index element={<Overview />} />
          <Route path="documentation" element={<DocumentationView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
        <Route
          path="/docs/:repoId"
          element={
            <ProtectedRoute>
              <Docs />
            </ProtectedRoute>
          }
        />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
