import express from 'express';
const router = express.Router();
import { getAllUsers, getUserProfile,deleteUser } from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Get all users - Protected and only for Admins
router.get('/', protect, isAdmin, getAllUsers);

// Get current user profile - Protected
router.get('/profile', protect, getUserProfile);

router.delete('/:id',protect,isAdmin, deleteUser)

export default router;