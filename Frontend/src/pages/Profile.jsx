import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Settings, LogOut, Package, Loader2, MapPin, Mail, Phone, User as UserIcon } from 'lucide-react'; // Added icons
import { API_URL } from '../App';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo}`,
          },
        };

        const { data } = await axios.get(`${API_URL}/users/profile`, config);
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, userInfo]);

  console.log(user)

  const handleLogout = () => {
    localStorage.removeItem('token'); // Fixed: Clear 'token' specifically
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface">
      <Loader2 className="animate-spin text-brand-primary" size={48} />
    </div>
  );

  const avatarLetter = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-brand-surface">
      <Navbar />
      <div className="max-w-xl mx-auto pt-32 pb-12 px-6">
        <div className="bg-white p-8 rounded-brand shadow-xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-brand-accent rounded-full mx-auto mb-4 flex items-center justify-center text-brand-primary text-4xl font-black italic shadow-inner">
              {avatarLetter}
            </div>
            <h2 className="text-2xl font-heading font-black">{user?.fullName}</h2>
            <span className="inline-block px-3 py-1 bg-brand-accent/20 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-wider mt-1">
              {user?.role}
            </span>
          </div>

          <hr className="border-stone-100 mb-8" />

          {/* User Details Grid */}
          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Email Address</p>
                <p className="text-stone-800 font-medium">{user?.email}</p>
              </div>
            </div>

             <div className="flex items-start gap-4">
              <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Phone Number</p>
                <p className="text-stone-800 font-medium">{user?._id || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Phone Number</p>
                <p className="text-stone-800 font-medium">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-stone-50 rounded-lg text-stone-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">Delivery Address</p>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {user?.address?.country || 'No address saved yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/orders')}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all"
            >
              <Package size={18}/> My Orders
            </button>

            <button className="w-full py-4 bg-brand-surface text-stone-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-100 transition-colors">
              <Settings size={18}/> Edit Profile
            </button>

            <button 
              onClick={handleLogout}
              className="w-full py-4 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut size={18}/> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;