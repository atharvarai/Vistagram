import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import FormInput from './ui/FormInput';
import Button from './ui/Button';
import Card from './ui/Card';
import Alert from './ui/Alert';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  const { register } = useAuth();

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'username':
        if (value.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete errors.username;
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          errors.password = 'Password must contain at least one letter and one number';
        } else {
          delete errors.password;
        }
        break;
      case 'confirmPassword':
        if (value !== password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;
    }
    
    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Final validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                Create account
              </h1>
              <p className="text-gray-600 text-sm">
                Join Vistagram and start sharing your experiences
              </p>
            </div>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormInput
                    id="username"
                label="Username"
                    type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateField('username', e.target.value);
                }}
                placeholder="Choose a username"
                    required
                error={fieldErrors.username}
                helperText="3+ characters, letters, numbers, and underscores only"
              />

              <FormInput
                    id="email"
                label="Email"
                    type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField('email', e.target.value);
                }}
                placeholder="Enter your email address"
                    required
                error={fieldErrors.email}
              />
                
                <div>
                <FormInput
                    id="password"
                  label="Password"
                    type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                    if (confirmPassword) {
                      validateField('confirmPassword', confirmPassword);
                    }
                  }}
                  placeholder="Create a password"
                    required
                  error={fieldErrors.password}
                />
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField('confirmPassword', e.target.value);
                }}
                placeholder="Confirm your password"
                required
                error={fieldErrors.confirmPassword}
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
                  disabled={Object.keys(fieldErrors).length > 0}
                >
                  Create account
                </Button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <span 
                  onClick={onSwitchToLogin}
                  style={{ cursor: 'pointer' }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in
                </span>
              </p>
            </div>

            {/* Terms Section */}
            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <span style={{ cursor: 'pointer' }} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span style={{ cursor: 'pointer' }} className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                  Privacy Policy
                </span>
              </p>
          </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register; 