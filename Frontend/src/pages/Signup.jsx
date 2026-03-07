import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Get API URL from Vite env
import { API_URL } from '../App';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role:'User'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);

          if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      
      toast.success('Account created successfully!', { id: loadingToast });
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } }
    catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center py-20 px-6">
      <Toaster position="top-center" />
      <div className="bg-white p-10 rounded-brand shadow-2xl w-full max-w-lg border border-stone-100">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-heading font-black text-brand-primary">Join the Flow</h2>
            <p className="text-stone-400 mt-2 font-light">Enter your details to register</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-widest ml-1 text-stone-400">Full Name</span>
                <input 
                  name="fullName"
                  required
                  onChange={handleChange}
                  type="text" 
                  placeholder="Aditya Sharma" 
                  className="w-full mt-1 p-4 bg-brand-surface rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all" 
                />
            </label>
            <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-widest ml-1 text-stone-400">Email Address</span>
                <input 
                  name="email"
                  required
                  onChange={handleChange}
                  type="email" 
                  placeholder="aditya@example.com" 
                  className="w-full mt-1 p-4 bg-brand-surface rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all" 
                />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-widest ml-1 text-stone-400">Mobile Number</span>
                <input 
                  name="phone"
                  required
                  onChange={handleChange}
                  type="text" 
                  placeholder="9876543210" 
                  className="w-full mt-1 p-4 bg-brand-surface rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all" 
                />
            </label>
            <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-widest ml-1 text-stone-400">Password</span>
                <input 
                  name="password"
                  required
                  onChange={handleChange}
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full mt-1 p-4 bg-brand-surface rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent transition-all" 
                />
            </label>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full mt-4 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-accent hover:text-brand-primary transition-all shadow-lg">
                Create Account
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-stone-400">
          Already part of the heritage? 
          <Link to="/login" className="text-brand-primary font-bold underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;