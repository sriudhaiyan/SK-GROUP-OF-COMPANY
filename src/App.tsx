/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { News } from './pages/News';
import { AppsList } from './pages/AppsList';
import { Characters } from './pages/Characters';
import { Channels } from './pages/Channels';
import { AppDetails } from './pages/AppDetails';
import { CharacterDetails } from './pages/CharacterDetails';
import { NexoraAI } from './pages/NexoraAI';
import { DashboardNav } from './components/DashboardNav';
import { OrbixBot } from './components/OrbixBot';
import { CharacterChat } from './components/CharacterChat';
import { AnimatePresence } from 'motion/react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><AppsList /></ProtectedRoute>} />
        <Route path="/characters" element={<ProtectedRoute><Characters /></ProtectedRoute>} />
        <Route path="/character/:id" element={<ProtectedRoute><CharacterDetails /></ProtectedRoute>} />
        <Route path="/channels" element={<ProtectedRoute><Channels /></ProtectedRoute>} />
        <Route path="/app/:id" element={<ProtectedRoute><AppDetails /></ProtectedRoute>} />
        <Route path="/nexora" element={<ProtectedRoute><NexoraAI /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={null} />
          <Route path="*" element={<DashboardNav />} />
        </Routes>
        <AnimatedRoutes />
        <Routes>
          <Route path="/auth" element={null} />
          <Route path="*" element={
            <>
              <OrbixBot />
              <CharacterChat />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
