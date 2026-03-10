// ! ||--------------------------------------------------------------------------------||
// ! ||                                   User Schema                                  ||
// ! ||--------------------------------------------------------------------------------||
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: { 
    type: String, 
    enum: ['User', 'Admin', 'Seller'], 
    default: 'User' 
  },
  // Systematic Address Block
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "India" }
  },
  otp:{
    type:String,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;