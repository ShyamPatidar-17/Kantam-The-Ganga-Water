// Authentication middleware
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from the token (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 4. Authorization Middleware (e.g., for Admin only)
export const isAdmin = (req, res, next) => {
    console.log("ssdd",req.user)
    if (req.user && (req.user.role === 'Admin'|| req.user.role==='Seller')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};