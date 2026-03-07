import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast components
import Navbar from '../components/Navbar';
import { API_URL } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Show a loading state immediately
    const loadingToast = toast.loading('Authenticating...');

    try {
       console.log("Respp")
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      console.log("Respp",response)

      // 2. Handle Success
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        
        
        // Replace loading toast with success message
        toast.success('Logged in successfully! Welcome back.', { id: loadingToast });

        // Redirect to Home (/) after 1.5 seconds
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      // 3. Handle Error
      // Get the specific error message from your backend (e.g., "Invalid Password")
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      
      // Replace loading toast with error message
      toast.error(errorMsg, { id: loadingToast });
      
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Ensure Toaster is rendered here to see the popups */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Navbar />
      <div className="flex items-center justify-center pt-32 px-6">
        <div className="bg-white p-10 rounded-brand shadow-2xl w-full max-w-md border border-stone-100">
          <h2 className="text-3xl font-heading font-black text-brand-primary mb-2">Welcome Back</h2>
          <p className="text-stone-500 mb-8 text-sm font-light">Enter your email or mobile to continue.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email or Mobile</label>
              <input 
                type="text" 
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                className="w-full p-4 bg-brand-surface rounded-2xl border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all" 
                placeholder="e.g. 9876543210" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 bg-brand-surface rounded-2xl border-none focus:ring-2 focus:ring-brand-accent outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-accent hover:text-brand-primary transition-all shadow-lg active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-stone-400">New to Kantam? </span>
            <Link to="/signup" className="text-brand-primary font-bold underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;