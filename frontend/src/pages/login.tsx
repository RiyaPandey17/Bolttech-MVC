import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/lib/auth';
import '@/styles/HomePage.css'; // reuse your CSS for consistent style

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/'); // redirect to home
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="page-container">
      <div className="content-box">
        <h1 className="app-title">BoltTech Car Rental</h1>
        <p className="tagline">Login to book your ride</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => router.push('/')}
            className="secondary-button"
          >
            Go to Home
          </button>
          <button
            onClick={() => router.push('/register')}
            className="primary-button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
