import { Router } from 'express';
import Suite from '../models/Suite.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();

// Number of units of a suite already booked for any overlapping night.
export async function unitsTaken(suiteId, checkIn, checkOut, excludeId) {
  const q = {
    suite: suiteId,
    status: { $in: ['pending', 'confirmed', 'checked-in'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeId) q._id = { $ne: excludeId };
  return Booking.countDocuments(q);
}

router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.species ? { species: req.query.species } : {};
  res.json(await Suite.find(filter).sort('pricePerNight'));
}));

// GET /api/suites/availability?checkIn=...&checkOut=...
router.get('/availability', asyncHandler(async (req, res) => {
  const checkIn = new Date(req.query.checkIn);
  const checkOut = new Date(req.query.checkOut);
  if (isNaN(checkIn) || isNaN(checkOut) || checkOut <= checkIn) throw new HttpError(400, 'Provide a valid checkIn and checkOut');
  const suites = await Suite.find().sort('pricePerNight');
  const result = await Promise.all(
    suites.map(async (s) => {
      const taken = await unitsTaken(s._id, checkIn, checkOut);
      return { suite: s._id, slug: s.slug, available: Math.max(0, s.units - taken), units: s.units };
    })
  );
  res.json(result);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const suite = await Suite.findOne({ slug: req.params.slug });
  if (!suite) throw new HttpError(404, 'Suite not found');
  res.json(suite);
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  res.status(201).json(await Suite.create(req.body));
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const suite = await Suite.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!suite) throw new HttpError(404, 'Suite not found');
  res.json(suite);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Suite.findByIdAndDelete(req.params.id);
  res.json({ message: 'Suite deleted' });
}));

export default router;
