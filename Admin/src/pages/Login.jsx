import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Phone } from 'lucide-react';

import {login} from '../api/index'; 

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); 
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    role: 'Admin'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Authenticating...');

    try {
      
      const { data } = await login(formData);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        toast.success(`Welcome back, ${data.name || 'Admin'}!`, { id: loadingToast });
        
       
        setTimeout(() => {
            window.location.href = "/"; 
        }, 1200);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Authentication failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 font-sans">
      <Toaster position="top-center" />
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            KANTAM<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium uppercase tracking-widest text-[10px]">
            Secure Admin Access
          </p>
        </div>

        {/* --- LOGIN METHOD SELECTOR --- */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
                type="button"
                onClick={() => { setLoginMethod('email'); setFormData({...formData, identifier: ''}); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
                <Mail size={16} /> Email
            </button>
            <button 
                type="button"
                onClick={() => { setLoginMethod('mobile'); setFormData({...formData, identifier: ''}); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${loginMethod === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
                <Phone size={16} /> Mobile
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">
                {loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}
            </span>
            <input 
              name="identifier"
              value={formData.identifier}
              required
              onChange={handleChange}
              type={loginMethod === 'email' ? 'email' : 'tel'} 
              placeholder={loginMethod === 'email' ? 'admin@kantam.com' : '9876543210'} 
              className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-700" 
            />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-slate-400">Password</span>
            <input 
              name="password"
              required
              onChange={handleChange}
              type="password" 
              placeholder="••••••••" 
              className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-slate-700" 
            />
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest text-xs active:scale-95">
            Sign In
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
          New to the portal? 
          <Link to="/signup" className="text-blue-600 ml-2 hover:underline">Register Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;