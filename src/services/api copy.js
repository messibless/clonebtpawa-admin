import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://betpaw.co.tz/api/',  
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Sending ${config.method.toUpperCase()} to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('❌ Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server');
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;