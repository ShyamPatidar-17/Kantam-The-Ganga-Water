// Order controller logic
import Order from '../models/Order.js';
import Bottle from '../models/Bottle.js';


/**
 * @desc    Create a new COD order
 * @route   POST /api/orders
 * @access  Private
 */

export const placeOrder = async (req, res) => {
    // 1. Log the incoming body to verify
    console.log("Checkout Body Received:", req.body.userId);

    try {
        const { items, totalAmount, userId, shippingAddress } = req.body;

        console.log("Userid:",userId)

        // Basic validation
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items found in order" });
        }
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // 2. Create the Order instance
        const newOrder = new Order({
            userId,
            items, 
            totalAmount,
            shippingAddress,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            paymentMethod: 'COD'
        });

        console.log("NewORder:",newOrder)

        // 3. Update Stock Inventory with Safety Check
        // We use a manual calculation instead of $inc to prevent crashes on 'null' stock
        const stockUpdatePromises = items.map(async (item) => {
            const bottle = await Bottle.findById(item.bottleId);
            
            if (!bottle) return null;

            // Safety: Ensure currentStock is a number. If null/undefined, treat as 0.
            const currentStock = typeof bottle.stock === 'number' ? bottle.stock : 0;
            const updatedStock = currentStock - item.quantity;

            return await Bottle.findByIdAndUpdate(
                item.bottleId,
                { $set: { stock: updatedStock } }, 
                { returnDocument: 'after' }
            );
        });

        await Promise.all(stockUpdatePromises);

        // 4. Save the order to Database
        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully via Cash on Delivery",
            order: savedOrder
        });

    } catch (error) {
        console.error("PLACE ORDER ERROR:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to place order." 
        });
    }
};
// 1. VIEW ORDERS (Role-based filtering)
// orderController.js - Updated getMyOrders
export const getMyOrders = async (req, res) => {
    try {
        // User Role: Only sees their own
        if (req.user.role === 'User') {
            const orders = await Order.find({ userId: req.user._id })
                .populate('items.bottleId');
            return res.status(200).json(orders);
        }

        // Seller/Admin Role: Needs full User details
        if (req.user.role === 'Seller' || req.user.role === 'Admin') {
            const sellerProducts = await Bottle.find({ sellerId: req.user._id }).select('_id');
            const productIds = sellerProducts.map(p => p._id);

            // Added .populate('userId') here
            const orders = await Order.find({
                'items.bottleId': { $in: productIds }
            })
            .populate('userId') // <--- This provides name, email, etc.
            .populate('items.bottleId');

            const filteredOrders = orders.map(order => {
                const doc = order.toObject();
                doc.items = doc.items.filter(item => 
                    productIds.some(id => id.equals(item.bottleId._id))
                );
                return doc;
            });

            return res.status(200).json(filteredOrders);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. UPDATE STATUS (Admin Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., "Shipped", "Delivered"

        const order = await Order.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. CANCEL ORDER (User Only - and only if Pending)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });

        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.status !== 'Pending') {
            return res.status(400).json({ message: "Cannot cancel order once processed" });
        }

        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};