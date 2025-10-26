// API configuration
// In production, use VITE_API_URL environment variable
// In development, use relative paths (Vite proxy handles it)
const PRODUCTION_API_URL = 'https://calsmacks-backend-production.up.railway.app';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? PRODUCTION_API_URL : '');

// Debug logging
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  mode: import.meta.env.MODE,
  fallback: PRODUCTION_API_URL
});

// Helper function to build API URLs
export const getApiUrl = (path: string): string => {
  const url = `${API_BASE_URL}${path}`;
  console.log('🌐 API URL:', url);
  return url;
};
