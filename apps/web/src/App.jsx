import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import ComplianceSentinel from './pages/ComplianceSentinel';
import SupportInterface from './pages/SupportInterface';
import DataFabric from './pages/DataFabric';
import Reports from './pages/Reports';
import Loans from './pages/Loans';
import DataIngestion from './pages/DataIngestion';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<CommandCenter />} />
        <Route path="loans" element={<Loans />} />
        <Route path="compliance" element={<ComplianceSentinel />} />
        <Route path="data" element={<DataFabric />} />
        <Route path="data-ingestion" element={<DataIngestion />} />
        <Route path="reports" element={<Reports />} />
        <Route path="agents" element={<SupportInterface />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
