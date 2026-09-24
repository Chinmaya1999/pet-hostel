import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import suiteRoutes from './routes/suites.js';
import serviceRoutes from './routes/services.js';
import bookingRoutes from './routes/bookings.js';
import updateRoutes from './routes/updates.js';
import reviewRoutes from './routes/reviews.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Wuffelune API', time: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/suites', suiteRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve the built React app from the same server.
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../client/dist');
  app.use(express.static(dist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🐾 Wuffelune API running on http://localhost:${PORT}`));
});
