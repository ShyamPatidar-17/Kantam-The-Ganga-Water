import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Loader2, Edit3, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchProfile, updateProfile } from '../api/index'; 

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [tempProfile, setTempProfile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const getIdentity = async () => {
            try {
                const { data } = await fetchProfile();
                setProfile(data);
                setTempProfile(data);
            } catch (err) {
                toast.error("Could not fetch identity.");
            } finally {
                setLoading(false);
            }
        };
        getIdentity();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const { data } = await updateProfile(tempProfile);
            const updatedUser = data.user || data;
            
            setProfile(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            toast.success("Identity updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("Update failed. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const cancelEdit = () => {
        setTempProfile(profile); 
        setIsEditing(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Identity...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                
                {/* --- Header Section --- */}
                <div className="bg-slate-900 p-12 text-white flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
                                {profile?.fullName}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <ShieldCheck size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {profile?.role} Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all border border-white/5"
                        >
                            <Edit3 size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Edit Identity</span>
                        </button>
                    )}
                </div>

                {/* --- Content Section --- */}
                <form onSubmit={handleSave} className="p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        
                        {/* Account Details */}
                        <div className="space-y-6">
                            <SectionLabel label="Account Details" />
                            
                            <EditableField 
                                label="Full Name" 
                                value={tempProfile?.fullName} 
                                isEditing={isEditing} 
                                icon={<User size={18}/>} 
                                onChange={(val) => setTempProfile({...tempProfile, fullName: val})}
                            />

                            <InfoField label="Email Address" value={profile?.email} icon={<Mail size={18}/>} />
                            
                            <EditableField 
                                label="Phone Number" 
                                value={tempProfile?.phone} 
                                isEditing={isEditing} 
                                icon={<Phone size={18}/>} 
                                onChange={(val) => setTempProfile({...tempProfile, phone: val})}
                            />
                        </div>

                        {/* Location Details */}
                        <div className="space-y-6">
                            <SectionLabel label="Firm Location" />
                            <EditableField 
                                label="Street Address" 
                                value={tempProfile?.address?.street} 
                                isEditing={isEditing} 
                                icon={<MapPin size={18}/>} 
                                onChange={(val) => setTempProfile({...tempProfile, address: {...tempProfile.address, street: val}})}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <EditableField 
                                    label="City" 
                                    value={tempProfile?.address?.city} 
                                    isEditing={isEditing} 
                                    onChange={(val) => setTempProfile({...tempProfile, address: {...tempProfile.address, city: val}})}
                                />
                                <EditableField 
                                    label="State" 
                                    value={tempProfile?.address?.state} 
                                    isEditing={isEditing} 
                                    onChange={(val) => setTempProfile({...tempProfile, address: {...tempProfile.address, state: val}})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="mt-12 flex items-center gap-4 animate-in slide-in-from-top-2">
                            <button 
                                type="submit"
                                disabled={updating}
                                className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                {updating ? <Loader2 className="animate-spin" /> : <><Check size={18}/> Save Changes</>}
                            </button>
                            <button 
                                type="button"
                                onClick={cancelEdit}
                                className="px-10 bg-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// --- Modularity Helpers ---

const SectionLabel = ({ label }) => (
    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">{label}</h4>
);

const InfoField = ({ label, value, icon }) => (
    <div className="space-y-1 opacity-60">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-4 text-slate-300">{icon}</div>
            <div className="w-full pl-12 p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm font-medium border border-transparent">
                {value || 'Not set'}
            </div>
        </div>
    </div>
);

const EditableField = ({ label, value, icon, isEditing, onChange }) => (
    <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            {icon && <div className={`absolute left-4 top-4 transition-colors ${isEditing ? 'text-blue-500' : 'text-slate-300'}`}>{icon}</div>}
            {isEditing ? (
                <input 
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-4 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-bold text-slate-900 shadow-sm"
                    style={{ paddingLeft: icon ? '3rem' : '1rem' }}
                />
            ) : (
                <div 
                    className="w-full p-4 bg-slate-50 rounded-2xl text-slate-900 text-sm font-black border border-transparent"
                    style={{ paddingLeft: icon ? '3rem' : '1rem' }}
                >
                    {value || '---'}
                </div>
            )}
        </div>
    </div>
);

export default Profile;