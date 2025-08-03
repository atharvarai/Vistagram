import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  showUserInfo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showUserInfo = true }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo at the very left */}
          <div className="w-10 h-10 flex items-center">
            <img 
              src="/logo.png" 
              alt="Vistagram" 
              style={{ width: '8%', height: '8%' }}
              className="object-contain"
            />
          </div>
          
          {/* Company name at the very right */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Vistagram
          </h1>
          
          {/* User info - only show when logged in */}
          {showUserInfo && user && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-700 font-medium">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 