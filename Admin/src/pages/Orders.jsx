import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { 
  Loader2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Package, 
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Orders with full population from Backend
  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sort: Latest orders on top
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      toast.error("Failed to synchronize with logistics database.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 2. Handle Status Change
  const changeStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state for smooth UX
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order set to ${newStatus}`);
    } catch (err) {
      toast.error("Status synchronization failed.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Analyzing Logistics...</span>
    </div>
  );

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header Section */}
      <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Logistics <span className="text-brand-accent font-light not-italic">Hub</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Global Pipeline Management</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={18} />
            <span className="font-black text-sm">{orders.length} Active Orders</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-[10px] font-black uppercase text-slate-400 border-b">
            <tr>
              <th className="p-8">Client Details</th>
              <th className="p-8">Shipment Vessel</th>
              <th className="p-8">Revenue (COD)</th>
              <th className="p-8">Flow Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o._id} className="group hover:bg-slate-50/50 transition-colors">
                
                {/* 1. Entire Client Detail Column */}
                <td className="p-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-brand-primary text-white rounded-xl group-hover:bg-brand-accent transition-colors">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none">{o.userId?.name || o.userId?.fullName || "Guest User"}</p>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Role: {o.userId?.role || 'User'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                        <p className="flex items-center gap-2 text-xs font-medium text-blue-500"><Mail size={12}/> {o.userId?.email}</p>
                        <p className="flex items-center gap-2 text-xs font-bold text-slate-600"><Phone size={12}/> {o.shippingAddress?.phone}</p>
                        <div className="flex items-start gap-2 text-[11px] text-slate-400 font-medium italic">
                            <MapPin size={12} className="mt-1 shrink-0" />
                            <span>
                                {o.shippingAddress?.street}, <br />
                                {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.zip}
                            </span>
                        </div>
                    </div>
                  </div>
                </td>

                {/* 2. Product Details */}
                <td className="p-8">
                   <div className="space-y-3">
                    {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg p-1 flex items-center justify-center">
                                <img src={item.bottleId?.images?.[0]} className="w-full h-full object-contain" alt="bottle" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-700 uppercase">{item.bottleId?.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.size} • Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                   </div>
                </td>

                {/* 3. Amount */}
                <td className="p-8">
                  <p className="text-2xl font-black text-brand-primary">₹{o.totalAmount}</p>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">
                    <Clock size={10} /> {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {/* 4. Status Control */}
                <td className="p-8">
                  <select 
                    value={o.status} 
                    onChange={(e) => changeStatus(o._id, e.target.value)} 
                    className={`border-none rounded-2xl text-[10px] font-black uppercase tracking-widest p-4 pr-10 cursor-pointer shadow-sm transition-all ${
                        o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        o.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        o.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-20 text-center">
            <Package className="mx-auto text-slate-100 mb-4" size={60} />
            <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">No vessel flow recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;