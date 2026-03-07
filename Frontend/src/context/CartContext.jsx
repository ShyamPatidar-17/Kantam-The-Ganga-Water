import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('kantam_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('kantam_cart', JSON.stringify(cart));
    }, [cart]);

    // 1. ADD TO CART (Fixed Double Toast & Added Stock Check)
    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find((item) => item._id === product._id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        // Safety: Check if adding more exceeds available stock
        if (currentQtyInCart + quantity > product.stock) {
            return toast.error(`Only ${product.stock} units available in source.`);
        }

        if (existingItem) {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            );
            toast.success(`Increased ${product.name} quantity`);
        } else {
            setCart((prevCart) => [...prevCart, { ...product, quantity }]);
            toast.success(`${product.name} added to collection`);
        }
    };

    // 2. UPDATE QUANTITY (With Stock Validation)
    const updateQuantity = (productId, newQuantity, maxStock) => {
        if (newQuantity < 1) return;
        
        if (newQuantity > maxStock) {
            return toast.error("Maximum available stock reached");
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // 3. REMOVE ITEM
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
        toast.error("Item removed from selection");
    };

    // 4. TOTALS & CONTEXT HELPERS
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            updateQuantity, 
            removeFromCart, 
            getCartTotal, 
            getCartCount,
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);