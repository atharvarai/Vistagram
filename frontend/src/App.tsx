import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Timeline from './components/Timeline';
import PublicPost from './components/PublicPost';
import Navbar from './components/Navbar';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <img 
                src="/logo.png" 
                alt="Vistagram" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="pt-6 pb-12">
        <Timeline />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/post/:postId" element={<PublicPost />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
