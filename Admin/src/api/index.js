import axios from 'axios';

const API = axios.create({ 
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` 
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// ! ||--------------------------------------------------------------------------------||
// ! ||                            // --- Auth Endpoints ---                           ||
// ! ||--------------------------------------------------------------------------------||
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ! ||--------------------------------------------------------------------------------||
// ! ||                          // --- Product Endpoints ---                          ||
// ! ||--------------------------------------------------------------------------------||
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/particular/${id}`);
export const fetchProductsBySeller = (sellerId) => API.get(`/products?sellerId=${sellerId}`);

export const addProduct = (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ! ||--------------------------------------------------------------------------------||
// ! ||                           // ---  User Endpoints ---                           ||
// ! ||--------------------------------------------------------------------------------||

export const updateProfile = (formData) => API.put('/users/update-profile', formData);
export const fetchAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const fetchProfile = () => API.get('/users/profile');



// ! ||--------------------------------------------------------------------------------||
// ! ||                           // ---  Order Endpoints ---                          ||
// ! ||--------------------------------------------------------------------------------||
export const fetchMyOrders = () => API.get('/orders/my-orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/status/${id}`, { status });
export const fetchAllOrders = () => API.get('/orders/my-orders');

export default API;