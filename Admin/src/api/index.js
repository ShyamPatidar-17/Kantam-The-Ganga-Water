import axios from 'axios';

// Ensure your .env has VITE_BACKEND_URL=http://localhost:5000
const API = axios.create({ 
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` 
});

// Attach Token to every request to fix 401 errors
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth Endpoints
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Product Endpoints (Multipart for Images)
export const addProduct = (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const fetchProducts = () => API.get('/products');

// Add this to your existing API file
export const fetchProductsBySeller = (sellerId) => API.get(`/products?sellerId=${sellerId}`);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Order Endpoints
export const fetchMyOrders = () => API.get('/orders/my-orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/status/${id}`, { status });

// User Endpoints
export const fetchAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;