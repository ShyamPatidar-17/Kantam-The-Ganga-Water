// ! ||--------------------------------------------------------------------------------||
// ! ||                      // Auth controller logic                                  ||
// ! ||                    // Login and signup (For both user and Admin)               ||
// ! ||--------------------------------------------------------------------------------||



import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           Register User or Seller                              ||
// ! ||--------------------------------------------------------------------------------||
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role,address } = req.body;

        // Check if user exists by email OR phone
        const userExists = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (userExists) {
            return res.status(400).json({ 
                message: 'User with this email or phone already exists' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       const user = await User.create({
    fullName,
    email,
    phone,
    password: hashedPassword,
    role: role || 'User',
    // Pass the address object directly { street, city, state, zip }
    address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        zip: address?.zip || "",
        country: address?.country || "India"
    }
});
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           Login with Email or phone                            ||
// ! ||--------------------------------------------------------------------------------||
export const loginUser = async (req, res) => {
    try {
        const { identifier, password, role } = req.body; 

        // 1. Build Query: Prevent CastError by checking if identifier is a number
        let queryConditions = [{ email: identifier }];
        if (!isNaN(identifier)) {
            queryConditions.push({ phone: identifier });
        }

        const user = await User.findOne({ $or: queryConditions });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // 2. Role Verification (Optional)
            // If the user tries to login to the Admin portal but is a 'user'
            if (role && user.role !== role) {
                return res.status(403).json({ 
                    message: `Access denied. You are registered as a ${user.role}.` 
                });
            }

            res.json({
                _id: user._id,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role, // This is key for frontend redirection
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           FORGOT PASSWORD AND SEND OTP                         ||
// ! ||--------------------------------------------------------------------------------||
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Identity not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Kantam Identity Verification",
        otp: otp
      });
     

      res.status(200).json({ success: true, message: "OTP transmitted to email." });
    } catch (err) {
      user.resetOtp = undefined;
      user.resetOtpExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email delivery failed." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           GENERATE NEW PASSWORD                                ||
// ! ||--------------------------------------------------------------------------------||
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

   
    const user = await User.findOne({ 
      email, 
    });

   

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP." });

    // Hash the new password (Assuming you use bcrypt)
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Security credentials updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};