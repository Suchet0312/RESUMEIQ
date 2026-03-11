import axios from 'axios';
import { getToken } from './storage';

const api = axios.create({
  baseURL: 'http://172.28.16.106:8080', 
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  console.log('🔐 AXIOS TOKEN =', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
