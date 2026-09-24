import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    petName: { type: String },
    petType: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, maxlength: 600 },
    avatar: { type: String },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
