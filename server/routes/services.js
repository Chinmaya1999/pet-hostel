import { Router } from 'express';
import Service from '../models/Service.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => res.json(await Service.find().sort('order'))));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  res.status(201).json(await Service.create(req.body));
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!s) throw new HttpError(404, 'Service not found');
  res.json(s);
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service deleted' });
}));

export default router;
