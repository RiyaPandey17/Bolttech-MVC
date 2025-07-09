import { api } from './axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:4000';

// Register new user
export async function register(name: string, email: string, password: string,licenseNumber: string, licenseValidUntil: string ) {
  const res = await api.post(`${API_URL}/api/auth/register`,  { name, email, password, licenseNumber, licenseValidUntil });
  localStorage.setItem('token', res.data.token);
  return res.data; // typically returns { user: {...} }
}

// Login user and store token
export async function login(email: string, password: string) {
  const res = await api.post(`${API_URL}/api/auth/login`, { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data.user;
}

// Logout: remove token
export function logout() {
  localStorage.removeItem('token');
}

export async function getCurrentUser() {
  const res = await api.get(`${API_URL}/api/auth/me`);
  return res.data;
}
