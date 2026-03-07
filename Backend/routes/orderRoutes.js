// Order routes


import express from 'express';
import { getMyOrders, updateOrderStatus, cancelOrder,placeOrder } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',protect,placeOrder)


// Everyone logged in can call this, but the controller filters the data
router.get('/my-orders', protect, getMyOrders);

// Only User can cancel their own order
router.put('/cancel/:id', protect, cancelOrder);

// Only Admin can update status to 'Shipped' or 'Delivered'
router.put('/status/:id', protect, isAdmin, updateOrderStatus);

export default router;