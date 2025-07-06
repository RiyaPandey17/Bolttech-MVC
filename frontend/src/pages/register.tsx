import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/lib/auth';
import '@/styles/HomePage.css'; // reuse your CSS

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseValidUntil, setLicenseValidUntil] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, licenseNumber, licenseValidUntil);
      router.push('/'); // redirect after register
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="page-container">
      <div className="content-box">
        <h1 className="app-title">BoltTech Car Rental</h1>
        <p className="tagline">Create your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
          <input
            type="text"
            placeholder="License Number"
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={licenseNumber}
            onChange={e => setLicenseNumber(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="License Valid Until"
            className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400"
            value={licenseValidUntil}
            onChange={e => setLicenseValidUntil(e.target.value)}
            required
          />
          <button type="submit" className="primary-button">
            Register
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
            onClick={() => router.push('/login')}
            className="primary-button"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
