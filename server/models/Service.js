import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    icon: { type: String, default: 'PawPrint' },
    short: { type: String },
    description: { type: String },
    features: [String],
    price: { type: Number, default: 0, min: 0 },
    unit: { type: String, enum: ['included', 'per-day', 'per-session'], default: 'per-session' },
    image: { type: String },
    accent: { type: String, default: '#FF6B4A' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
