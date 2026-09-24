import { Router } from 'express';
import Pet from '../models/Pet.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);

const FIELDS = ['name', 'species', 'breed', 'age', 'weight', 'gender', 'photo', 'vaccinated', 'feedingInstructions', 'medications', 'allergies', 'vetName', 'vetPhone', 'notes'];
const pick = (body) => Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

async function findOwnPet(req) {
  const pet = await Pet.findById(req.params.id);
  if (!pet) throw new HttpError(404, 'Pet not found');
  if (!pet.owner.equals(req.user._id) && req.user.role !== 'admin') throw new HttpError(403, 'Not your pet');
  return pet;
}

router.get('/', asyncHandler(async (req, res) => {
  res.json(await Pet.find({ owner: req.user._id }).sort('-createdAt'));
}));

router.post('/', asyncHandler(async (req, res) => {
  const pet = await Pet.create({ ...pick(req.body), owner: req.user._id });
  res.status(201).json(pet);
}));

router.get('/:id', asyncHandler(async (req, res) => res.json(await findOwnPet(req))));

router.put('/:id', asyncHandler(async (req, res) => {
  const pet = await findOwnPet(req);
  Object.assign(pet, pick(req.body));
  await pet.save();
  res.json(pet);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const pet = await findOwnPet(req);
  const active = await Booking.exists({ pet: pet._id, status: { $in: ['pending', 'confirmed', 'checked-in'] } });
  if (active) throw new HttpError(400, `${pet.name} has an active booking and can't be removed`);
  await pet.deleteOne();
  res.json({ message: 'Pet removed' });
}));

export default router;
