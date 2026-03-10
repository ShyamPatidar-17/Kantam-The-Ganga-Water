import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Helper to get current User ID from localStorage
    const getUserId = () => {
        const userData = localStorage.getItem('user');
        if (!userData) return 'guest'; // Fallback for non-logged in users
        try {
            const user = JSON.parse(userData);
            return user._id || user.id;
        } catch (e) {
            return 'guest';
        }
    };

    const [userId, setUserId] = useState(getUserId());

    // 1. Initialize cart using a Dynamic Key: kantam_cart_[userId]
    const [cart, setCart] = useState(() => {
        const activeUserId = getUserId();
        const savedCart = localStorage.getItem(`kantam_cart_${activeUserId}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Watch for User Changes (Login/Logout)
    // This ensures that if User A logs out and User B logs in, the cart refreshes
    useEffect(() => {
        const handleAuthChange = () => {
            const newId = getUserId();
            setUserId(newId);
            const savedCart = localStorage.getItem(`kantam_cart_${newId}`);
            setCart(savedCart ? JSON.parse(savedCart) : []);
        };

        // Listen for storage events (manual login/logout)
        window.addEventListener('storage', handleAuthChange);
        return () => window.removeEventListener('storage', handleAuthChange);
    }, []);

    // 3. Sync to localStorage using the Dynamic Key
    useEffect(() => {
        localStorage.setItem(`kantam_cart_${userId}`, JSON.stringify(cart));
    }, [cart, userId]);

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find((item) => item._id === product._id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

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

    const updateQuantity = (productId, newQuantity, maxStock) => {
        if (newQuantity < 1) return;
        if (newQuantity > maxStock) return toast.error("Maximum stock reached");

        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
        toast.error("Item removed", { duration: 1000 });
    };

    const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, updateQuantity, removeFromCart, 
            getCartTotal, getCartCount, clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);