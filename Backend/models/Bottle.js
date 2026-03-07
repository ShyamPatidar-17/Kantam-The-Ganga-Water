// Product schema
import mongoose from 'mongoose';

const bottleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: [true, 'A seller reference is mandatory']
  },
  size: {
    type: String,
    required: true,
    enum: {
      values: ['250ml', '500ml', '1ltr', '2ltr', '10ltr'],
      message: '{VALUE} is not a valid size'
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Array of image URLs (up to 4)
  images: {
    type: [String],
    validate: {
      validator: function(val) {
        return val.length <= 4;
      },
      message: 'You can upload a maximum of 4 images.'
    },
    required: [true, 'At least one product image is required']
  },
  stock: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters']
  }
}, { 
  timestamps: true 
});

const Bottle = mongoose.model('Bottle', bottleSchema);
export default Bottle;