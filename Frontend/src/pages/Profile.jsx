import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Package, Loader2, MapPin, Mail, Phone, Save, Edit3, Globe, Hash } from 'lucide-react';
// 1. Import centralized API functions
import { fetchUserProfile, updateUserProfile } from '../api/index'; 
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '', country: 'India' }
  });

  // 2. Refactored Fetch Identity
  const getIdentity = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUserProfile(); // No manual token needed
      setUser(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          zip: data.address?.zip || '',
          country: data.address?.country || 'India'
        }
      });
    } catch (err) {
      toast.error('Failed to load identity');
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIdentity();
  }, []);

  // 3. Refactored Update Identity
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await updateUserProfile(formData);
      
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success("Identity synchronized successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Synchronization failed");
    } finally {
      setUpdating(false);
    }
  };

  // ... (Keep the rest of your JSX and handleLogout logic)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Radhe Radhe! Logged out successfully');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  const avatarLetter = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'K';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto pt-32 pb-24 px-6">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="bg-slate-900 p-12 text-center relative">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl rotate-3">
              {avatarLetter}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{user?.fullName}</h2>
            <span className="inline-block px-4 py-1 bg-white/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest mt-2 border border-white/5">
              Verified {user?.role || 'User'} Identity
            </span>
          </div>

          <div className="p-10">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <EditField label="Full Name" icon={<Settings size={16}/>} value={formData.fullName} onChange={(v) => setFormData({...formData, fullName: v})} />
                  <EditField label="Mobile Number" icon={<Phone size={16}/>} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12}/> Delivery Location Details
                  </p>
                  
                  <input placeholder="Street Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.address.street} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="City" className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.address.city} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} />
                    <input placeholder="State" className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.address.state} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                  </div>

                  {/* ZIP AND COUNTRY ADDED HERE */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Hash className="absolute left-4 top-4 text-slate-300" size={16} />
                      <input placeholder="Zip Code" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.address.zip} onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})} />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-4 text-slate-300" size={16} />
                      <input placeholder="Country" className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.address.country} onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={updating} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                    {updating ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Save Identity</>}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <DetailItem icon={<Mail size={20} />} label="Email Address" value={user?.email} />
                  <DetailItem icon={<Phone size={20} />} label="Mobile Number" value={user?.phone || 'Not provided'} />
                  
                  <div className="md:col-span-2 flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><MapPin size={22} /></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Delivery Address</p>
                      {user?.address?.street ? (
                        <div className="text-slate-800 text-sm leading-relaxed font-bold">
                          <p>{user.address.street}</p>
                          <p className="mt-1">{user.address.city}, {user.address.state} — {user.address.zip}</p>
                          <p className="mt-1 text-blue-600 uppercase text-[10px] tracking-widest">{user.address.country}</p>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-sm font-medium">No address saved yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => navigate('/orders')} className="py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                    <Package size={18}/> My Orders
                  </button>
                  <button onClick={() => setIsEditing(true)} className="py-5 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-100 transition-all">
                    <Edit3 size={18}/> Edit Profile
                  </button>
                  <button onClick={handleLogout} className="sm:col-span-2 py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-50 rounded-2xl transition-colors mt-4">
                    <LogOut size={16}/> Sign Out Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-slate-800 font-black text-sm tracking-tight">{value}</p>
    </div>
  </div>
);

const EditField = ({ label, icon, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-4 text-blue-600">{icon}</div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm"
      />
    </div>
  </div>
);

export default Profile;