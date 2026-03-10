import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { register } from '../api/index'; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating your account...');

    try {
      // Clean API call using the service layer
      const { data } = await register(formData);

      if (data.token) {
        toast.success('Account created! Please login.', { id: loadingToast });
        setTimeout(() => navigate('/login'), 2000);
      } 
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 font-sans">
      <Toaster position="top-center" />
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Join the <span className="text-blue-600">flow.</span>
            </h2>
            <p className="text-slate-400 mt-2 text-[10px] font-black uppercase tracking-widest">
              Establish a new identity in the stream
            </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Account Role */}
          <div className="md:col-span-2">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Account Role</span>
             <select 
                name="role" 
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700 appearance-none cursor-pointer"
             >
                <option value="user">Standard User</option>
                <option value="seller">Product Seller</option>
                <option value="admin">System Admin</option>
             </select>
          </div>

          {/* Column 1 */}
          <div className="space-y-4">
            <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Full Name</span>
                <input name="fullName" required onChange={handleChange} type="text" placeholder="Aditya Sharma" 
                  className="w-full mt-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700" />
            </label>
            <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Email Address</span>
                <input name="email" required onChange={handleChange} type="email" placeholder="aditya@example.com" 
                  className="w-full mt-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700" />
            </label>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Mobile Number</span>
                <input name="phone" required onChange={handleChange} type="text" placeholder="9876543210" 
                  className="w-full mt-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700" />
            </label>
            <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Password</span>
                <input name="password" required onChange={handleChange} type="password" placeholder="••••••••" 
                  className="w-full mt-1 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700" />
            </label>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-xs active:scale-95">
                Register Account
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Already part of the heritage? 
          <Link to="/login" className="text-blue-600 font-bold underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;