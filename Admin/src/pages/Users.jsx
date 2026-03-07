import React, { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser } from '../api';
import { Mail, Phone, Search, ShieldCheck, ShoppingBag, User as UserIcon, X, Trash2, UserCircle, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeRole, setActiveRole] = useState("all");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data } = await fetchAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users");
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                await deleteUser(id);
                toast.success(`${name} removed from system`);
                // Update local state to remove the user from UI
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
            }
        }
    };

    const rowConfigs = [
        { bg: 'bg-indigo-50/50', text: 'text-indigo-900', accent: 'text-indigo-600' },
        { bg: 'bg-rose-50/50', text: 'text-rose-900', accent: 'text-rose-600' },
        { bg: 'bg-amber-50/50', text: 'text-amber-900', accent: 'text-amber-600' },
        { bg: 'bg-emerald-50/50', text: 'text-emerald-900', accent: 'text-emerald-600' },
        { bg: 'bg-violet-50/50', text: 'text-violet-900', accent: 'text-violet-600' }
    ];

    const filteredUsers = users.filter(u => {
        const name = u.fullName || "";
        const email = u.email || "";
        const phone = u.phone ? u.phone.toString() : "";
        const uid = u._id || "";

        const matchesSearch = 
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm) ||
            uid.includes(searchTerm);
        
        const userRole = u.role || "user";
        const matchesRole = activeRole === "all" || userRole.toLowerCase() === activeRole.toLowerCase();
        
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4">
            
            {/* --- Header Controls --- */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {["all", "admin", "seller", "user"].map((role) => (
                        <button key={role} onClick={() => setActiveRole(role)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRole === role ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                            {role}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-2.5 text-slate-300" size={18} />
                    <input type="text" placeholder="Search matrix..." className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border-none rounded-xl text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* --- Data Matrix --- */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">S.No</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Name</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Email</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Mobile</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest">UID</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Role</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u, index) => {
                                const config = rowConfigs[index % 5];
                                return (
                                    <tr key={u._id} className={`${config.bg} border-b border-white transition-colors hover:brightness-95`}>
                                        <td className="p-5 text-center font-black text-slate-400 text-xs">{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-lg ${config.bg.replace('/50', '')} flex items-center justify-center ${config.accent}`}>
                                                    <UserCircle size={18} />
                                                </div>
                                                <span className={`font-black text-xs uppercase tracking-tight ${config.text}`}>{u.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-xs font-medium text-slate-600 lowercase italic">{u.email}</td>
                                        <td className="p-5 text-xs font-bold text-slate-700">{u.phone}</td>
                                        <td className="p-5 text-[10px] font-mono text-slate-400">{u._id}</td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 text-[9px] font-black uppercase tracking-tighter shadow-sm">
                                                {u.role === 'admin' ? <ShieldCheck size={12} className="text-rose-500" /> : u.role === 'seller' ? <ShoppingBag size={12} className="text-blue-500" /> : <UserIcon size={12} className="text-emerald-500" />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDelete(u._id, u.fullName)}
                                                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}