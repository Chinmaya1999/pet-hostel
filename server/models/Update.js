import mongoose from 'mongoose';

// A daily "pawgress report" posted by staff for a pet during its stay.
const updateSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, trim: true },
    message: { type: String, required: [true, 'Message is required'] },
    mood: { type: String, enum: ['happy', 'playful', 'calm', 'sleepy', 'anxious'], default: 'happy' },
    ateBreakfast: { type: Boolean, default: true },
    ateDinner: { type: Boolean, default: true },
    walks: { type: Number, default: 2, min: 0 },
    medsGiven: { type: Boolean, default: false },
    healthNote: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Update', updateSchema);
