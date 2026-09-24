import { Router } from 'express';
import Contact from '../models/Contact.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  await Contact.create({ name, email, phone, subject, message });
  res.status(201).json({ message: "Thanks! We'll get back to you within a few hours. 🐾" });
}));

router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  res.json(await Contact.find().sort('-createdAt'));
}));

router.patch('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!msg) throw new HttpError(404, 'Message not found');
  res.json(msg);
}));

export default router;
