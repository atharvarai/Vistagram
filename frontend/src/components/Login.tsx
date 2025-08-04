import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import FormInput from './ui/FormInput';
import Button from './ui/Button';
import Card from './ui/Card';
import Alert from './ui/Alert';

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
    <div className="min-h-screen">
      <Navbar showUserInfo={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-8 px-4">
        <div className="w-full max-w-md">
          <Card glass={true} shadow="xl" padding="lg" className="transform hover:scale-[1.02] transition-transform duration-300">
            
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/logo.png" 
                  alt="Vistagram" 
                  className="object-contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Welcome back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your Vistagram account
              </p>
            </div>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormInput
                    id="username"
                label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />

              <FormInput
                    id="password"
                label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {error && (
                <Alert variant="error" onClose={() => setError('')}>
                  <span className="font-medium">{error}</span>
                </Alert>
              )}

              <div className="flex justify-center mt-6">
                <Button
                type="submit"
                  loading={loading}
                  size="md"
                  style={{ cursor: 'pointer' }}
                  className="px-12"
                >
                  Sign in
                </Button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <span 
                  onClick={onSwitchToRegister}
                  style={{ cursor: 'pointer' }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign up
                </span>
              </p>
          </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login; 