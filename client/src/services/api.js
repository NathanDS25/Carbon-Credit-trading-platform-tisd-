import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth tokens and mock role headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // In dev mode, send the selected role to sync backend
    if (token === 'MOCK_DEV_TOKEN' && role) {
      config.headers['X-Mock-Role'] = role;
    }
  }
  return config;
});

export default api;
