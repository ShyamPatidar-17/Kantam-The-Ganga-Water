import axios from 'axios';

// ! ||--------------------------------------------------------------------------------||
// ! ||                              1. Create Axios Instance                          ||
// ! ||--------------------------------------------------------------------------------||

const API = axios.create({ 
    baseURL: `${import.meta.env.VITE_BACKEND_URL}` 
});

// ! ||--------------------------------------------------------------------------------||
// ! ||             2. Request Interceptor: Attach JWT Token to every request          ||
// ! ||--------------------------------------------------------------------------------||
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ! ||--------------------------------------------------------------------------------||
// ! ||                           // 3. Response Interceptor:                          ||
// ! ||--------------------------------------------------------------------------------||
// Handle Global Errors (like Token expiration)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        }
        return Promise.reject(error);
    }
);

// ! ||--------------------------------------------------------------------------------||
// ! ||                              AUTHENTICATION ENDPOINTS                          ||
// ! ||--------------------------------------------------------------------------------||
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ! ||--------------------------------------------------------------------------------||
// ! ||                    /* --- PRODUCT / BOTTLE ENDPOINTS --- */                    ||
// ! ||--------------------------------------------------------------------------------||
// Fetch all products for the public gallery
export const fetchAllProducts = () => API.get('/products');

// Fetch products filtered by a specific seller (for Seller Dashboard)
export const fetchSellerProducts = (sellerId) => API.get(`/products?sellerId=${sellerId}`);


// Fetch a single product by ID
export const fetchProductById = (id) => API.get(`/products/particular/${id}`);

// Add new product (Uses FormData for Image Uploads)
export const addProduct = (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Delete a product listing
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ! ||--------------------------------------------------------------------------------||
// ! ||                     /* --- USER MANAGEMENT ENDPOINTS --- */                    ||
// ! ||--------------------------------------------------------------------------------||
// Admin only: Get all registered users
export const fetchAllUsers = () => API.get('/users');

//Get Particular User Profile
export const fetchUserProfile = () => API.get('/users/profile');

// Admin only: Delete a user account
export const deleteUser = (id) => API.delete(`/users/${id}`);


// Update user identity details
export const updateUserProfile = (formData) => API.put('/users/update-profile', formData);

//Forgot and Reset Password
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (data) => API.put('/auth/reset-password', data);

// ! ||--------------------------------------------------------------------------------||
// ! ||                          /* --- ORDER ENDPOINTS --- */                         ||
// ! ||--------------------------------------------------------------------------------||

//Place Orders
export const placeOrder = (orderData) => API.post('/orders', orderData);


// Fetch orders for the logged-in user or seller
export const fetchMyOrders = () => API.get('/orders/my-orders');

// Cancel an order (User Action)
export const cancelOrder = (orderId) => API.put(`/orders/cancel/${orderId}`);

// Update order status (Pending -> Delivered)
export const updateOrderStatus = (id, status) => API.put(`/orders/status/${id}`, { status });


export default API;
