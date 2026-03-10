import React, { useState } from 'react';
import { Mail, ShieldCheck, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


import { forgotPassword, resetPassword } from '../api/index'; 

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: Send OTP using central API
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("OTP Sent!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 & 3: Reset Logic
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (step === 2) {
      if (otp.length !== 6) return toast.error("Enter valid 6-digit OTP");
      setStep(3);
      return;
    }

    setLoading(true);
    try {

      await resetPassword({ email, otp, newPassword });
      
      toast.success("Security Updated! Please Login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 transition-all">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {step === 1 ? <Mail size={28}/> : step === 2 ? <ShieldCheck size={28}/> : <Lock size={28}/>}
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            {step === 1 ? "Verify Identity" : step === 2 ? "Confirm OTP" : "Secure Account"}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Step {step} of 3
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
              <input 
                type="email" required placeholder="Enter Registered Email"
                className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-sm"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <>Send Reset OTP <ArrowRight size={16}/></>}
            </button>
          </form>
        )}

        {(step === 2 || step === 3) && (
          <form onSubmit={step === 2 ? (e) => {e.preventDefault(); setStep(3)} : handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {step === 2 && (
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  type="text" required placeholder="6-Digit OTP" maxLength="6"
                  className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black tracking-[0.5em] text-center"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  type="password" required placeholder="New Secure Password"
                  className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            )}

            <button disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : step === 2 ? "Verify OTP" : "Update Credentials"}
            </button>
            
            <button type="button" onClick={() => setStep(step - 1)} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <ArrowLeft size={12}/> Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;