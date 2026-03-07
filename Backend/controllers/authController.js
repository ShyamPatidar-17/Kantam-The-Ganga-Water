// Auth controller logic
// Login and signup (For both user and Admin)

import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register User or Seller
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

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
            phone, // Added phone field
            password: hashedPassword,
            role: role || 'User'
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

// @desc    Login with Email or phone
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