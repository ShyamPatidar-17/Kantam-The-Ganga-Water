// ! ||--------------------------------------------------------------------------------||
// ! ||                               Order controller logic                           ||
// ! ||--------------------------------------------------------------------------------||

import Order from "../models/Order.js";
import Bottle from "../models/Bottle.js";
import User from "../models/User.js";
import { sendCustomerEmail, sendSellerEmail } from "./emailController.js";


// ! ||--------------------------------------------------------------------------------||
// ! ||                                    1. PLace Order                              ||
// ! ||--------------------------------------------------------------------------------||
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, userId, shippingAddress,fullName } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items found" });
    }

    // 1. Create Order instance
    const newOrder = new Order({
      userId,
      fullName: fullName,
      items,
      totalAmount,
      shippingAddress,
      status: "Pending",
      paymentMethod: "COD",
    });

    // 2. Update Stock & Identify Sellers
    const sellerIds = new Set();
    const stockUpdatePromises = items.map(async (item) => {
      const bottle = await Bottle.findById(item.bottleId);
      if (bottle) {
        sellerIds.add(bottle.sellerId.toString());
        const currentStock = typeof bottle.stock === "number" ? bottle.stock : 0;
        return await Bottle.findByIdAndUpdate(item.bottleId, {
          $set: { stock: currentStock - item.quantity },
        });
      }
    });

    await Promise.all(stockUpdatePromises);

    // 3. Save and then POPULATE bottle details
    let savedOrder = await newOrder.save();
   
    // This fills the 'bottleId' field with the actual Bottle document
    const populatedOrder = await Order.findById(savedOrder._id).populate("items.bottleId");

   
    // Convert to plain object to avoid Mongoose "undefined" issues in template
    const orderDataForEmail = populatedOrder.toObject();

    

    // 4. TRIGGER EMAILS
    try {
      const customer = await User.findById(userId);
      if (customer) {
         sendCustomerEmail(
          orderDataForEmail,
          customer.email,
          fullName || "Valued Customer"
        );
      }

      for (let sId of sellerIds) {
        const seller = await User.findById(sId);
        if (seller && seller.email) {
           sendSellerEmail(orderDataForEmail, seller.email, fullName);
        }
      }
    } catch (mailErr) {
      console.error("Mail system error:", mailErr);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                       2. VIEW ORDERS (Role-based filtering)                    ||
// ! ||--------------------------------------------------------------------------------||
export const getMyOrders = async (req, res) => {
  try {
    // User Role: Only sees their own
    if (req.user.role === "User") {
      const orders = await Order.find({ userId: req.user._id }).populate(
        "items.bottleId",
      );
      return res.status(200).json(orders);
    }

    // Seller/Admin Role: Needs full User details
    if (req.user.role === "Seller" || req.user.role === "Admin") {
      const sellerProducts = await Bottle.find({
        sellerId: req.user._id,
      }).select("_id");
      const productIds = sellerProducts.map((p) => p._id);

      // Added .populate('userId') here
      const orders = await Order.find({
        "items.bottleId": { $in: productIds },
      })
        .populate("userId") // <--- This provides name, email, etc.
        .populate("items.bottleId");

      const filteredOrders = orders.map((order) => {
        const doc = order.toObject();
        doc.items = doc.items.filter((item) =>
          productIds.some((id) => id.equals(item.bottleId._id)),
        );
        return doc;
      });

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                           3. UPDATE STATUS (Admin Only)                        ||
// ! ||--------------------------------------------------------------------------------||
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., "Shipped", "Delivered"

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                 4. CANCEL ORDER (User Only - and only if Pending)              ||
// ! ||--------------------------------------------------------------------------------||
export const cancelOrder = async (req, res) => {
  try {
    // 1. Find the order and verify ownership
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found at the source" });
    }

    // Security Check: Ensure the user cancelling is the one who placed it
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized cancellation request" });
    }

    // 2. Status Check
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Vessel already in transit. Cannot cancel." });
    }

    // 3. RESTOCK: Add quantities back to product stock
    for (const item of order.items) {
      await Bottle.findByIdAndUpdate(item.bottleId, {
        $inc: { stock: item.quantity }
      });
    }

    // 4. Update Status
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ message: "Internal server error during cancellation" });
  }
};
