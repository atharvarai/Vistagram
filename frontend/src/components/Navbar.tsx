import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  showUserInfo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showUserInfo = true }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-1">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Vistagram" 
              className="object-contain"
              style={{ width: '8%', height: '8%' }}
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Vistagram
            </h1>
          </div>
          
          {/* User info - only show when logged in */}
          {showUserInfo && user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-700 font-medium">
                  {user.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-800 hover:text-white border border-black rounded-lg transition-all duration-200 font-medium whitespace-nowrap hover:shadow-lg hover:scale-105"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid black'
                }}
              >
                Sign&nbsp;out
              </button>
            </div>
          ) : (
            <div className="w-8 h-8"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 