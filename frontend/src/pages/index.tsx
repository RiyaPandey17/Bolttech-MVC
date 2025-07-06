import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import Link from 'next/link';
import './../styles/HomePage.css';
import dotenv from 'dotenv';
dotenv.config();


interface User {
  id: string;
  email: string;
  name?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.API_URL || 'http://localhost:4000';
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get(`${API_URL}/api/auth/me`);
        if (res.data?.id) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="content-box">
        <h1 className="app-title">BoltTech Car Rental</h1>
        <p className="tagline">Drive your dreams today</p>

        {user ? (
          <>
            <p className="welcome-message">
              Welcome back,
              <span className="highlight"> {user.name || user.email}</span>
            </p>
            <Link href="/bookings" className="primary-button">
              View your bookings
            </Link>
          </>
        ) : (
          <>
            <p className="tagline">
              Discover premium cars & book instantly in seconds.
            </p>
            <div>
              <Link href="/login" className="secondary-button">Login</Link>
              <Link href="/register" className="primary-button">Register</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

