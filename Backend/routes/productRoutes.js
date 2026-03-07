import express from 'express';
import { addProduct, deleteProduct, getProducts,updateProduct,getParticularProduct } from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

// Public route: Everyone can see the water bottles
router.get('/', getProducts);

router.get('/particular/:id',getParticularProduct)

// Protected routes: Must be logged in to add products
router.post('/', protect, isAdmin, upload.array('images', 4), addProduct);

router.put('/:id',protect,isAdmin, upload.array('images', 4), updateProduct);

// Restricted route: Only Admins can delete products
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;