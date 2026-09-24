import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error messages so components can just show err.message.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || (err.request && !err.response ? 'Cannot reach the server — is the API running?' : err.message);
    return Promise.reject(Object.assign(new Error(message), { status: err.response?.status }));
  }
);

export default api;
