import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SellerProducts from './pages/SellerProducts';
import EditItem from './pages/EditItem';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

export const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload(); // Ensures the state is fully cleared
  };

  // --- REFINED PROTECTED LAYOUT (No Sidebar) ---
  const ProtectedLayout = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return (
      <div className="min-h-screen bg-slate-50">
        {/* The Navbar now carries all the navigation tasks */}
        <Navbar user={user} onLogout={handleLogout} />
        
        {/* Main content now spans full width */}
        <main className="max-w-[1600px] mx-auto p-6 md:p-10 animate-in fade-in duration-700">
          {children}
        </main>
      </div>
    );
  };

  return (
    <BrowserRouter>
      {/* 1-second toast duration as per your branding request */}
      <Toaster 
        position="top-right" 
        toastOptions={{ duration: 1000 }} 
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        {/* Protected Management Routes */}
        <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/addItem" element={<ProtectedLayout><AddItem /></ProtectedLayout>} />
         
         {/* Profile ROutes */}
         <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
         <Route path="/profile" element={<ProtectedLayout><EditProfile /></ProtectedLayout>} />

        {/* Fixed: Moved editItem inside the ProtectedLayout */}
        <Route path="/editItem/:id" element={<ProtectedLayout><EditItem /></ProtectedLayout>} />
        
        <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
        <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
        <Route path="/my-inventory" element={<ProtectedLayout><SellerProducts /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;