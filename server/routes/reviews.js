import { Router } from 'express';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await Review.find({ approved: true }).sort('-createdAt').limit(24));
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { rating, comment, petName, petType } = req.body;
  const review = await Review.create({
    user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating, comment, petName, petType,
  });
  res.status(201).json(review);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review deleted' });
}));

export default router;
