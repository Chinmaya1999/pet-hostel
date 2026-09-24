import { Router } from 'express';
import Update from '../models/Update.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);

// Latest updates across all of the owner's bookings.
router.get('/feed', asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id }).select('_id');
  const updates = await Update.find({ booking: { $in: bookings.map((b) => b._id) } })
    .populate('pet', 'name photo species')
    .populate('author', 'name')
    .sort('-createdAt')
    .limit(30);
  res.json(updates);
}));

router.get('/booking/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new HttpError(404, 'Booking not found');
  if (!booking.owner.equals(req.user._id) && req.user.role !== 'admin') throw new HttpError(403, 'Not your booking');
  res.json(await Update.find({ booking: booking._id }).populate('author', 'name').sort('-createdAt'));
}));

router.post('/', adminOnly, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.booking);
  if (!booking) throw new HttpError(404, 'Booking not found');
  const { title, message, mood, ateBreakfast, ateDinner, walks, medsGiven, healthNote, photo } = req.body;
  const update = await Update.create({
    booking: booking._id, pet: booking.pet, author: req.user._id,
    title, message, mood, ateBreakfast, ateDinner, walks, medsGiven, healthNote, photo,
  });
  res.status(201).json(await update.populate([{ path: 'pet', select: 'name photo' }, { path: 'author', select: 'name' }]));
}));

router.delete('/:id', adminOnly, asyncHandler(async (req, res) => {
  await Update.findByIdAndDelete(req.params.id);
  res.json({ message: 'Update deleted' });
}));

export default router;
