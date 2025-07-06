import express from 'express';
import cors from 'cors';
import authRouter from './infrastructure/api/routes/auth';
import bookingRouter from './infrastructure/api/routes/bookings';
import availabilityRouter from './infrastructure/api/routes/availability';

const app = express();

// Middleware
app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`, // adjust to your frontend origin
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/availability', availabilityRouter);

// Health check
app.get('/', (_req, res) => {
  res.send('🚀 BoltTech Car Rental API running!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

export default app;
