import axios from 'axios';

const httpClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url === '/users/me';
    const isLoginPage = window.location.pathname === '/login';
    if (error.response?.status === 401 && !isAuthCheck && !isLoginPage) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
