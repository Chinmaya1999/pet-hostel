import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/asyncHandler.js';

const router = Router();

const sendAuth = (res, user, status = 200) => res.status(status).json({ token: user.signToken(), user });

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) throw new HttpError(400, 'Name, email and password are required');
    if (await User.findOne({ email: email.toLowerCase() })) throw new HttpError(409, 'An account with this email already exists');
    const user = await User.create({ name, email, password, phone }); // role always defaults to owner
    sendAuth(res, user, 201);
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new HttpError(400, 'Email and password are required');
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) throw new HttpError(401, 'Invalid email or password');
    sendAuth(res, user);
  })
);

router.get('/me', protect, (req, res) => res.json({ user: req.user }));

router.put(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const { name, phone, address, avatar, password } = req.body;
    const user = await User.findById(req.user._id);
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password;
    await user.save();
    res.json({ user });
  })
);

export default router;
