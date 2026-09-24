import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    suite: { type: mongoose.Schema.Types.ObjectId, ref: 'Suite', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    services: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        name: String,
        price: Number,
        unit: String,
        qty: { type: Number, default: 1 },
        subtotal: Number,
      },
    ],
    suiteSubtotal: { type: Number, required: true },
    servicesSubtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    specialInstructions: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    reference: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre('validate', function () {
  if (!this.reference) {
    this.reference = 'WL-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 5).toUpperCase();
  }
});

export default mongoose.model('Booking', bookingSchema);
