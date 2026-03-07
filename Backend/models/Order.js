import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    bottleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bottle', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
    size: { type: String }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' }, 
  status: { type: String, enum: ['Pending', 'Processing', 'Delivered'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' }
}, { timestamps: true });

// --- THE MISSING PART ---
// This turns the schema into a "Model" that can be imported elsewhere
const Order = mongoose.model('Order', orderSchema);

export default Order;