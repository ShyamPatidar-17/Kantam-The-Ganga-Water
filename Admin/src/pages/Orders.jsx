import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Phone, Mail, User, Package, Calendar, Lock, Clock, TrendingUp, Search, Filter} from 'lucide-react';
import toast from 'react-hot-toast';

import {fetchAllOrders,updateOrderStatus} from '../api/index'; 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAllOrders();
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      toast.error("Logistics synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // --- Filter Logic ---
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      o.shippingAddress?.phone?.includes(searchString) || 
      o.userId?.email?.toLowerCase().includes(searchString) ||
      o.fullName?.toLowerCase().includes(searchString) ||
      o.userId?.fullName?.toLowerCase().includes(searchString);

    return matchesStatus && matchesSearch;
  });

  const changeStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success(`Flow updated to ${newStatus}`);
    } catch (err) {
      toast.error("Status update failed.");
    }
  };

  const getRowBg = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100/80 hover:bg-emerald-200/90 text-emerald-900';
      case 'Cancelled': return 'bg-rose-100/80 hover:bg-rose-200/90 text-rose-900';
      case 'Shipped': return 'bg-blue-100/80 hover:bg-blue-200/90 text-blue-900';
      case 'Processing': return 'bg-indigo-100/80 hover:bg-indigo-200/90 text-indigo-900';
      case 'Pending': return 'bg-amber-100/80 hover:bg-amber-200/90 text-amber-900';
      default: return 'bg-white hover:bg-slate-50';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Analyzing Logistics...</span>
    </div>
  );

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden font-body mb-20">
      
      {/* --- Header Section --- */}
      <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Logistics <span className="text-blue-600 font-light not-italic">Hub</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Order Pipeline Management</p>
        </div>
        
        {/* Statistics Badge */}
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <TrendingUp size={18} className="text-blue-600" />
            <span className="font-black text-sm uppercase tracking-tight">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Stream' : 'Streams'} Found
            </span>
        </div>
      </div>

      {/* --- Advanced Filter Bar --- */}
      <div className="px-10 py-6 bg-white border-b border-slate-50 flex flex-col md:flex-row gap-4">
        {/* Search Input (Phone/Email) */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text"
            placeholder="Search by Phone, Email, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-[10px] font-black uppercase text-slate-500 border-b">
            <tr>
              <th className="p-8">Client Details</th>
              <th className="p-8">Shipment Vessel</th>
              <th className="p-8">Revenue</th>
              <th className="p-8">Flow Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((o) => {
              const isLocked = o.status === 'Delivered' || o.status === 'Cancelled';
              return (
                <tr key={o._id} className={`transition-all duration-300 ${getRowBg(o.status)}`}>
                  <td className="p-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl shadow-sm ${isLocked ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white'}`}>
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none truncate max-w-[150px] uppercase">{o.fullName || o.userId?.fullName || "Guest"}</p>
                          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">ID: {o._id.slice(-10)}</span>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                          <p className="flex items-center gap-2 text-xs font-medium text-blue-600 italic underline tracking-tighter">
                            <Mail size={12}/> {o.userId?.email}
                          </p>
                          <p className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Phone size={12}/> {o.shippingAddress?.phone}
                          </p>
                      </div>
                    </div> 
                  </td>

                  <td className="p-8">
                    <div className="space-y-3">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-12 bg-white rounded-lg p-1 flex items-center justify-center border border-slate-100 shadow-sm">
                            <img src={item.bottleId?.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" alt="vessel" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{item.bottleId?.name}</p>
                            <p className="text-[9px] font-bold text-blue-900 uppercase tracking-widest mt-1">{item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-8">
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{o.totalAmount}</p>
                    <div className="flex items-center gap-1 text-[9px] font-black text-red-900 uppercase tracking-widest mt-1">
                      <Calendar size={10} /> {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="p-8 text-right">
                    <div className="relative inline-block w-full">
                      <select 
                        disabled={isLocked}
                        value={o.status} 
                        onChange={(e) => changeStatus(o._id, e.target.value)} 
                        className={`appearance-none w-full border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest p-4 pr-12 outline-none shadow-sm transition-all ${
                            isLocked ? 'bg-white/50 text-slate-400 cursor-not-allowed' :
                            o.status === 'Shipped' ? 'bg-blue-600 text-white' :
                            o.status === 'Processing' ? 'bg-indigo-600 text-white' :
                            o.status === 'Delivered' ? 'bg-emerald-600 text-white' :
                            o.status === 'Cancelled' ? 'bg-red-600 text-white' :
                            'bg-amber-500 text-white'
                        }`}
                      >
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s} className="bg-white text-slate-900">{s}</option>
                        ))}
                      </select>
                      <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!isLocked ? 'text-white' : 'text-slate-300'}`}>
                        {isLocked ? <Lock size={14} /> : <Clock size={14} className="animate-pulse" />}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Empty State --- */}
      {filteredOrders.length === 0 && (
          <div className="py-40 text-center">
              <Package className="mx-auto text-slate-100 mb-4" size={60} />
              <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">
                {orders.length === 0 ? "No vessels in the stream" : "No results match your filter"}
              </p>
          </div>
      )}
    </div>
  );
};

export default AdminOrders;