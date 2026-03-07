// Auth routes

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Both Sellers and Users post to these same endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);



export default router;