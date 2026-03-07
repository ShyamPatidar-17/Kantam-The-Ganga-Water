import Bottle from '../models/Bottle.js';
import { v2 as cloudinary } from 'cloudinary';

// 1. ADD Product (Create)
export const addProduct = async (req, res) => {
    try {
        const { name, sellerId, size, price, stock, description } = req.body;
        
        // req.files is populated by your Cloudinary storage engine
        // 'path' in Cloudinary storage refers to the full HTTPS URL
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const newBottle = new Bottle({
            name,
            sellerId,
            size,
            price,
            images: imageUrls, // Storing full URLs like https://res.cloudinary.com/...
            stock,
            description
        });

        const savedBottle = await newBottle.save();
        res.status(201).json({ success: true, data: savedBottle });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. VIEW Products (Remains largely the same)
export const getProducts = async (req, res) => {
    try {
        const { id } = req.query; 
        if (id) {
            const bottle = await Bottle.findById(id).populate('sellerId', 'name email');
            if (!bottle) return res.status(404).json({ message: "Product not found" });
            return res.status(200).json(bottle);
        }
        const bottles = await Bottle.find().sort({ createdAt: -1 });
        res.status(200).json(bottles);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getParticularProduct=async(req,res)=>{
    try{
        const { id } = req.params;
        const bottle = await Bottle.findById(id);
        console.log(bottle)
        if (!bottle) return res.status(404).json({ message: "Product not found" });
         res.status(200).json(bottle);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } 
};

// 3. UPDATE Product

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const bottle = await Bottle.findById(id);
        if (!bottle) return res.status(404).json({ message: "Product not found" });

        // 1. Parse existing images sent from frontend
        // If frontend sends JSON.stringify, we parse it; otherwise default to empty array
        let finalImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

        // 2. Identify images that were REMOVED to delete them from Cloudinary
        const removedImages = bottle.images.filter(img => !finalImages.includes(img));
        
        if (removedImages.length > 0) {
            const deletePromises = removedImages.map(imgUrl => {
                const publicId = imgUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(`products/${publicId}`);
            });
            await Promise.all(deletePromises);
        }

        // 3. Add NEWLY uploaded images from Cloudinary (via Multer)
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            finalImages = [...finalImages, ...newImageUrls];
        }

        // 4. Update the database
        const updateData = {
            ...req.body,
            images: finalImages.slice(0, 4) // Ensure we never exceed 4
        };

        const updatedBottle = await Bottle.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: updatedBottle });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. DELETE Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const bottle = await Bottle.findById(id);

        if (!bottle) return res.status(404).json({ message: "Product not found" });

        // Cleanup: Delete images from Cloudinary storage
        if (bottle.images && bottle.images.length > 0) {
            const deletePromises = bottle.images.map(imgUrl => {
                // Extract public_id from URL: "http://.../folder/v123/public_id.jpg"
                const parts = imgUrl.split('/');
                const filename = parts.pop(); // e.g., "unique_id.jpg"
                const publicId = filename.split('.')[0]; 
                // If you used a folder in your storage config, include it:
                return cloudinary.uploader.destroy(`products/${publicId}`);
            });
            await Promise.all(deletePromises);
        }

        await Bottle.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product and Cloudinary images deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};