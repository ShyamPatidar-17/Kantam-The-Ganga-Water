import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Save, Loader2, ArrowLeft } from 'lucide-react';

import {updateProfile} from '../api/index'; 

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: { street: '', city: '', state: '', zip: '' }
    });

    
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setForm({
                fullName: storedUser.fullName || '',
                phone: storedUser.phone || '',
                address: {
                    street: storedUser.address?.street || '',
                    city: storedUser.address?.city || '',
                    state: storedUser.address?.state || '',
                    zip: storedUser.address?.zip || ''
                }
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await updateProfile(form);

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success("Identity Updated Successfully");
                navigate('/profile');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-6 animate-in fade-in duration-500">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-black uppercase text-[10px] tracking-widest transition-colors"
            >
                <ArrowLeft size={14} /> Back to Profile
            </button>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/50">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-10">
                    Edit <span className="text-blue-600">Identity</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-4 text-slate-300" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-700"
                                    value={form.fullName}
                                    onChange={(e) => setForm({...form, fullName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-700"
                                    value={form.phone}
                                    onChange={(e) => setForm({...form, phone: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 ml-2">
                            <MapPin size={12} /> Firm Location
                        </label>
                        <input 
                            placeholder="Street Address" 
                            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                            value={form.address.street}
                            onChange={(e) => setForm({...form, address: {...form.address, street: e.target.value}})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="City" 
                                className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                value={form.address.city}
                                onChange={(e) => setForm({...form, address: {...form.address, city: e.target.value}})}
                            />
                            <input 
                                placeholder="State" 
                                className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                                value={form.address.state}
                                onChange={(e) => setForm({...form, address: {...form.address, state: e.target.value}})}
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={16}/> Sync Identity</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;