// ! ||--------------------------------------------------------------------------------||
// ! ||                             User controller logic                              ||
// ! ||--------------------------------------------------------------------------------||

import User from '../models/User.js';


// ! ||--------------------------------------------------------------------------------||
// ! ||                       1. Get All Users (Admin Dashboard)                       ||
// ! ||--------------------------------------------------------------------------------||
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                     2. Get User Profile (Both Admin and User)                  ||
// ! ||--------------------------------------------------------------------------------||
export const getUserProfile = async (req, res) => {
    try {  
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

// ! ||--------------------------------------------------------------------------------||
// ! ||                              3. Update the Profile                             ||
// ! ||--------------------------------------------------------------------------------||
export const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    phone,
                    address: {
                        street: address?.street || "",
                        city: address?.city || "",
                        state: address?.state || "",
                        zip: address?.zip || "",
                        country: address?.country || "India" // Matches Schema default
                    }
                }
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Profile synchronized with database", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                            4. Delete User (Admin Only)                         ||
// ! ||--------------------------------------------------------------------------------||
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