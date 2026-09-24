import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Pet name is required'], trim: true },
    species: { type: String, enum: ['dog', 'cat', 'rabbit', 'bird', 'other'], required: true },
    breed: { type: String, trim: true },
    age: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    photo: { type: String },
    vaccinated: { type: Boolean, default: false },
    feedingInstructions: { type: String },
    medications: { type: String },
    allergies: { type: String },
    vetName: { type: String },
    vetPhone: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Pet', petSchema);
