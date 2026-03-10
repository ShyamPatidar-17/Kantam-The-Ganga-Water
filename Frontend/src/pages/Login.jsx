import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Droplets, Fingerprint } from 'lucide-react';

import { login } from '../api/index'; 
import Navbar from '../components/Navbar';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Synchronizing Identity...');

    try {
  
      const response = await login(formData);
      
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); 
        
        toast.success('Radhe Radhe 🙏, Welcome back.', { id: loadingToast });

        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    } catch (error) {
      // 3. Centralized error message handling
      const errorMsg = error.response?.data?.message || 'Authentication failed.';
      toast.error(errorMsg, { id: loadingToast });
    }
  };
  
  
return (
    <div className="min-h-screen bg-slate-50 font-body">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center pt-32 pb-20 px-6">
        {/* Decorative Brand Icon */}
        <div className="mb-8 p-4 bg-white rounded-3xl shadow-xl shadow-blue-500/10 animate-bounce-slow">
           <Droplets size={40} className="text-blue-600" />
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">
              Kantam <span className="text-blue-600 not-italic font-light">Login</span>
            </h2>
            <p className="text-slate-400 mb-10 text-xs font-black uppercase tracking-[0.2em]">
              Access your sacred vessel history
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identifier Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email or Mobile</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    name="identifier"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-900" 
                    placeholder="e.g. 9876543210" 
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                   <Link to="/forgot" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-slate-900" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="group w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
              >
                Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">New to the journey?</p>
              <Link to="/signup" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all">
                Create Account <Fingerprint size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Support Text */}
        <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
          Secure • Systematic • Spiritual
        </p>
      </div>
    </div>
  );
};

export default Login;