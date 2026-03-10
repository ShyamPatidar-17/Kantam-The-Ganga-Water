import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, Droplets, Globe } from 'lucide-react';

import { register } from '../api/index'; 
import Navbar from '../components/Navbar';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'User',
    address: { street: '', city: '', state: '', zip: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zip'].includes(name)) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Establishing your identity...');

    try {
      
      const response = await register(formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success('Radhe Radhe! Welcome to the Kantam family.', { id: loadingToast });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
      <div className="min-h-screen bg-slate-50 font-body">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center pt-32 pb-20 px-6">
        {/* Branding Icon */}
        <div className="mb-8 p-4 bg-white rounded-3xl shadow-xl shadow-blue-500/10">
           <Droplets size={40} className="text-blue-600" />
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-2xl border border-slate-100 relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">
                Join the <span className="text-blue-600 not-italic font-light">Source</span>
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                Radhe Radhe! Create your heritage account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1: Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Identity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField icon={<User size={18}/>} label="Full Name" name="fullName" placeholder="Aditya Sharma" onChange={handleChange} />
                  <InputField icon={<Mail size={18}/>} label="Email Address" name="email" type="email" placeholder="aditya@example.com" onChange={handleChange} />
                  <InputField icon={<Phone size={18}/>} label="Mobile Number" name="phone" placeholder="9876543210" onChange={handleChange} />
                  <InputField icon={<Lock size={18}/>} label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Destination</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputField icon={<MapPin size={18}/>} label="Street Address" name="street" placeholder="House No, Building, Area" onChange={handleChange} />
                  </div>
                  <InputField icon={<Globe size={18}/>} label="City" name="city" placeholder="Ujjain" onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="State" name="state" placeholder="MP" onChange={handleChange} />
                    <InputField label="Zip Code" name="zip" placeholder="456001" onChange={handleChange} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="group w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
              >
                Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Already part of the heritage?</p>
              <Link to="/login" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">
                Access your Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component with Icon Support
const InputField = ({ label, name, type = "text", placeholder, onChange, icon }) => (
  <label className="block space-y-2">
    <span className="text-[9px] font-black uppercase tracking-widest ml-2 text-slate-400">{label}</span>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
      <input 
        name={name}
        required
        onChange={onChange}
        type={type} 
        placeholder={placeholder} 
        className={`w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all text-sm font-medium text-slate-900 ${icon ? 'pl-12' : 'pl-4'}`}
      />
    </div>
  </label>
);

export default Signup;