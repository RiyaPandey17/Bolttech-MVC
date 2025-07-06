// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // replace with your backend URL
  withCredentials: true              // important: send cookies for auth
});

export default api;
