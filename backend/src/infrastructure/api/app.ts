// src/infrastructure/api/app.ts
import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth';  // adjust path

const app = express();

app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// your routes
app.use('/api/auth', authRoutes);

// default health check
app.get('/', (req, res) => {
  res.send('API is running!');
});

export default app;
