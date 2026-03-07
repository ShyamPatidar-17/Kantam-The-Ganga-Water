// User controller logic


import User from '../models/User.js';

// @desc    Get all users (Admin only typically)
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
    try {
        // req.user is usually set by an auth middleware (see below)
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Optional: Prevent deleting the last remaining admin
            if (user.role === 'Admin') {
                const adminCount = await User.countDocuments({ role: 'Admin' });
                if (adminCount <= 1) {
                    return res.status(400).json({ message: 'Cannot delete the only remaining administrator' });
                }
            }

            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};