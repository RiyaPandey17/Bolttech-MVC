import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import '@/styles/BookingsPage.css';
import dotenv from 'dotenv';
dotenv.config();

interface Booking { id: string; carId: string; brand: string; model: string; dateFrom: string; dateTo: string; totalPrice: number; }
interface AvailableCar { carId: string; brand: string; model: string; totalPrice: number; averageDailyPrice: number; stock: number; available: number; }
interface DecodedToken { userId: string; exp: number; iat: number; }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableCars, setAvailableCars] = useState<AvailableCar[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchingCars, setFetchingCars] = useState(false);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const API_URL = process.env.API_URL || 'http://localhost:4000';;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.userId); setChecked(true);
    } catch { localStorage.removeItem('token'); window.location.href = '/login'; }
  }, []);

  useEffect(() => {
    if (!checked || !userId) return;
    api.get(`${API_URL}/api/bookings`, { params: { userId } })
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [checked, userId]);

  async function handleCheckAvailability(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!startDate || !endDate) return setError('Please select both dates.');
    if (startDate < today) return setError('Start date cannot be before today.');
    if (endDate < startDate) return setError('End date cannot be before start date.');
    setFetchingCars(true); setAvailableCars([]);
    try {
      const res = await api.get(`${API_URL}/api/availability`, {
        params: { dateFrom: startDate, dateTo: endDate, userId }
      });
      setAvailableCars(res.data);
      if (res.data.length === 0) setError('No cars available for these dates or You already have an active booking for these dates. Please choose different dates.')
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to fetch cars'); }
    finally { setFetchingCars(false); }
  }

  async function handleBookCar(carId: string) {
    try {
      await api.post(`${API_URL}/api/bookings`, {
        userId, carId, dateFrom: startDate, dateTo: endDate,
        licenseNumber: 'DL-123456',
        licenseValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      });
      const res = await api.get('${API_URL}/api/bookings', { params: { userId } });
      setBookings(res.data);
      alert('Booking successful!');
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create booking'); }
  }

  function handleLogout() { localStorage.removeItem('token'); window.location.href = '/login'; }

  if (!checked) return null;
  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="app-title">BoltTech Car Rental</h1>
        <button onClick={handleLogout} className="secondary-button">Logout</button>
      </div>

      <div className="main-content">
        <section className="section">
          <h2>Your Bookings</h2>
          {error && <div className="error">{error}</div>}
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map(b => (
              <div key={b.id} className="list-item">
                <strong>{b.brand} {b.model}</strong><br/>
                {b.dateFrom} → {b.dateTo}<br/>
                Total: ${Number(b.totalPrice).toFixed(2)}
              </div>
            ))
          )}
        </section>

        <section className="section">
          <h2>🔍 Check Car Availability</h2>
          <form onSubmit={handleCheckAvailability} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input type="date" value={startDate} min={today} onChange={e => setStartDate(e.target.value)} required/>
            <input type="date" value={endDate} min={startDate || today} onChange={e => setEndDate(e.target.value)} required/>
            <button type="submit" className="primary-button">{fetchingCars ? 'Checking...' : 'Show Cars'}</button>
          </form>
        </section>

        {availableCars.length > 0 && (
          <section className="section">
            <h2>Available Cars</h2>
            {availableCars.map(car => (
              <div key={car.carId} className="list-item">
                <strong>{car.brand} {car.model}</strong><br/>
                Total: ${Number(car.totalPrice).toFixed(2)}<br/>
                Daily: ${Number(car.averageDailyPrice).toFixed(2)}<br/>
                <button onClick={() => handleBookCar(car.carId)} className="primary-button" style={{ marginTop: '0.3rem' }}>Book this car</button>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
