const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
  ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export default config; 