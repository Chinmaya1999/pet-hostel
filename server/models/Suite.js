import mongoose from 'mongoose';

const suiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String },
    description: { type: String },
    species: [{ type: String, enum: ['dog', 'cat', 'rabbit', 'bird', 'other'] }],
    pricePerNight: { type: Number, required: true, min: 0 },
    size: { type: String },
    units: { type: Number, default: 5, min: 1 }, // how many identical rooms exist
    amenities: [String],
    image: { type: String },
    gallery: [String],
    accent: { type: String, default: '#FF6B4A' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Suite', suiteSchema);
