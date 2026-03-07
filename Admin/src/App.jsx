import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SellerProducts from './pages/SellerProducts';
import EditItem from './pages/EditItem';


export const API_URL = import.meta.env.VITE_BACKEND_URL + '/api';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const ProtectedLayout = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/addItem" element={<ProtectedLayout><AddItem /></ProtectedLayout>} />
        <Route path="/editItem/:id" element={<EditItem />} />"
        <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
        <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
        <Route path="/my-inventory" element={<ProtectedLayout><SellerProducts /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;