import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar showUserInfo={false} />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                <img 
                  src="/logo.png" 
                  alt="Vistagram" 
                  style={{ width: '30%', height: '30%' }}
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Welcome back
              </h2>
              <p className="text-slate-600 text-lg">
                Sign in to your Vistagram account
              </p>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-base font-semibold text-slate-700 mb-3">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400 text-lg"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-base font-semibold text-slate-700 mb-3">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400 text-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-base font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-slate-600 hover:text-slate-900 text-base font-medium transition-colors duration-200"
                >
                  Don't have an account? <span className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 