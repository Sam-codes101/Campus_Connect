import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import LostFound from './pages/LostFound';
import Community from './pages/Community';
import Updates from './pages/Updates';
import AdminUpdates from './pages/AdminUpdates';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function NotFound() {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-5xl font-black text-slate-800 tracking-tight">404</h2>
      <p className="text-slate-500 text-sm">The campus page you are looking for does not exist.</p>
      <Link
        to="/dashboard"
        className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public & Core Student Routes */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="library" element={<Library />} />
        <Route path="lost-found" element={<LostFound />} />
        <Route path="community" element={<Community />} />
        <Route path="updates" element={<Updates />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Student Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin/updates"
          element={
            <AdminRoute>
              <AdminUpdates />
            </AdminRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
