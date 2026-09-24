import { Router } from 'express';
import Booking from '../models/Booking.js';
import Pet from '../models/Pet.js';
import Suite from '../models/Suite.js';
import Service from '../models/Service.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';
import { unitsTaken } from './suites.js';

const router = Router();
router.use(protect);

const TAX_RATE = 0.05;
const DAY = 24 * 60 * 60 * 1000;
const populate = [
  { path: 'pet' },
  { path: 'suite', select: 'name slug image pricePerNight accent' },
  { path: 'owner', select: 'name email phone' },
];

// Price a booking on the server — never trust totals sent by the client.
async function quote({ petId, suiteId, checkIn, checkOut, services = [] }, user) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (isNaN(inDate) || isNaN(outDate)) throw new HttpError(400, 'Please choose valid dates');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (inDate < today) throw new HttpError(400, 'Check-in cannot be in the past');
  const nights = Math.round((outDate - inDate) / DAY);
  if (nights < 1) throw new HttpError(400, 'Stay must be at least one night');
  if (nights > 60) throw new HttpError(400, 'Stays longer than 60 nights need a custom plan — please contact us');

  const pet = await Pet.findById(petId);
  if (!pet || !pet.owner.equals(user._id)) throw new HttpError(400, 'Please choose one of your pets');

  const suite = await Suite.findById(suiteId);
  if (!suite) throw new HttpError(400, 'Please choose a suite');
  if (suite.species.length && !suite.species.includes(pet.species)) {
    throw new HttpError(400, `${suite.name} isn't suitable for a ${pet.species}`);
  }

  const ids = services.map((s) => (typeof s === 'string' ? s : s.service));
  const docs = ids.length ? await Service.find({ _id: { $in: ids } }) : [];
  const lines = docs.map((d) => {
    const qty = d.unit === 'per-day' ? nights : 1;
    return { service: d._id, name: d.name, price: d.price, unit: d.unit, qty, subtotal: d.price * qty };
  });

  const suiteSubtotal = suite.pricePerNight * nights;
  const servicesSubtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const tax = Math.round((suiteSubtotal + servicesSubtotal) * TAX_RATE);
  return {
    pet, suite, checkIn: inDate, checkOut: outDate, nights,
    services: lines, suiteSubtotal, servicesSubtotal, tax,
    totalPrice: suiteSubtotal + servicesSubtotal + tax,
  };
}

router.post('/quote', asyncHandler(async (req, res) => {
  const q = await quote(req.body, req.user);
  const taken = await unitsTaken(q.suite._id, q.checkIn, q.checkOut);
  res.json({ ...q, pet: q.pet._id, suite: q.suite._id, available: q.suite.units - taken > 0 });
}));

router.post('/', asyncHandler(async (req, res) => {
  const q = await quote(req.body, req.user);
  const taken = await unitsTaken(q.suite._id, q.checkIn, q.checkOut);
  if (taken >= q.suite.units) throw new HttpError(409, `${q.suite.name} is fully booked for those dates — try another suite or dates`);

  const clash = await Booking.exists({
    pet: q.pet._id,
    status: { $in: ['pending', 'confirmed', 'checked-in'] },
    checkIn: { $lt: q.checkOut },
    checkOut: { $gt: q.checkIn },
  });
  if (clash) throw new HttpError(409, `${q.pet.name} already has a stay booked in those dates`);

  const booking = await Booking.create({
    ...q,
    pet: q.pet._id,
    suite: q.suite._id,
    owner: req.user._id,
    specialInstructions: req.body.specialInstructions,
    emergencyContact: req.body.emergencyContact,
  });
  res.status(201).json(await booking.populate(populate));
}));

router.get('/mine', asyncHandler(async (req, res) => {
  res.json(await Booking.find({ owner: req.user._id }).populate(populate).sort('-checkIn'));
}));

router.get('/', adminOnly, asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await Booking.find(filter).populate(populate).sort('-createdAt'));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(populate);
  if (!booking) throw new HttpError(404, 'Booking not found');
  if (!booking.owner._id.equals(req.user._id) && req.user.role !== 'admin') throw new HttpError(403, 'Not your booking');
  res.json(booking);
}));

router.patch('/:id/cancel', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new HttpError(404, 'Booking not found');
  if (!booking.owner.equals(req.user._id) && req.user.role !== 'admin') throw new HttpError(403, 'Not your booking');
  if (!['pending', 'confirmed'].includes(booking.status)) throw new HttpError(400, `A ${booking.status} booking can't be cancelled`);
  booking.status = 'cancelled';
  if (booking.paymentStatus === 'paid') booking.paymentStatus = 'refunded';
  await booking.save();
  res.json(await booking.populate(populate));
}));

router.patch('/:id/status', adminOnly, asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new HttpError(404, 'Booking not found');
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  await booking.save();
  res.json(await booking.populate(populate));
}));

export default router;
