import { Router } from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Contact from '../models/Contact.js';
import Suite from '../models/Suite.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', asyncHandler(async (req, res) => {
  const now = new Date();
  const [owners, pets, newMessages, byStatus, revenueAgg, currentGuests, suites, monthly] = await Promise.all([
    User.countDocuments({ role: 'owner' }),
    Pet.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'checked-in', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Booking.countDocuments({ status: 'checked-in' }),
    Suite.find().select('units'),
    Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' }, checkIn: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      { $group: { _id: { y: { $year: '$checkIn' }, m: { $month: '$checkIn' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
  ]);
  const totalUnits = suites.reduce((s, x) => s + x.units, 0);
  res.json({
    owners,
    pets,
    newMessages,
    currentGuests,
    totalUnits,
    occupancy: totalUnits ? Math.round((currentGuests / totalUnits) * 100) : 0,
    revenue: revenueAgg[0]?.total || 0,
    byStatus: Object.fromEntries(byStatus.map((b) => [b._id, b.count])),
    monthly: monthly.map((m) => ({ month: `${m._id.y}-${String(m._id.m).padStart(2, '0')}`, revenue: m.revenue, count: m.count })),
  });
}));

export default router;
