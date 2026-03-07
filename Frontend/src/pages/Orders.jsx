import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_URL } from '../App';
import { Loader2, Package, Calendar, MapPin, XCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const userOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch and Sort Orders (Latest First)
  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Sort by date: Newest on top
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      toast.error("Failed to fetch your order history");
      console.error("Order Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // 2. Handle Order Cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Order cancelled successfully");
      fetchMyOrders(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Synchronizing your history...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto pt-40 px-6">
        
        {/* Page Header */}
        <div className="mb-16">
          <h2 className="text-6xl font-heading font-black text-brand-primary tracking-tighter uppercase">
            My <span className="text-brand-accent italic font-light">Journey</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">Tracking your Himalayan hydration vessels</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[3.5rem] p-24 text-center border border-slate-100 shadow-inner">
            <Package className="mx-auto text-slate-100 mb-6" size={80} strokeWidth={1} />
            <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs mb-8">No vessels found at the source</p>
            <button onClick={() => window.location.href = '/'} className="bg-brand-primary text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all">Explore Collection</button>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-700">
                
                {/* Order Header: ID & Status */}
                <div className="p-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-6 bg-slate-50/30">
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-[1.5rem] shadow-sm group-hover:rotate-12 transition-transform">
                      <Package size={22} className="text-brand-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Order ID</span>
                      <p className="font-black text-brand-primary text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                       <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body: Products & Pricing */}
                <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6">
                        {/* Image Logic Fix */}
                        <div className="w-16 h-20 bg-slate-50 rounded-2xl flex-shrink-0 p-2 flex items-center justify-center border border-slate-50 shadow-inner">
                          <img 
                            src={item.bottleId?.images?.[0] || 'https://via.placeholder.com/150'} 
                            className="w-full h-full object-contain mix-blend-multiply" 
                            alt="vessel" 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-brand-primary text-base uppercase tracking-tight">{item.bottleId?.name || "Sacred Vessel"}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            {item.size} <span className="mx-2">•</span> Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-between items-end border-l border-slate-50 pl-12">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount (COD)</p>
                      <p className="text-5xl font-black text-brand-primary tracking-tighter">₹{order.totalAmount}</p>
                    </div>

                    <div className="flex items-center gap-6 mt-10">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
                        <Calendar size={14} className="text-brand-accent" /> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      
                      {order.status === 'Pending' && (
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center gap-2 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-all hover:scale-105"
                        >
                          <XCircle size={14} /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Destination */}
                <div className="bg-slate-50/50 p-6 px-10 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-brand-accent" /> 
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase opacity-30">
                      Logistics Processed <ChevronRight size={12}/>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default userOrders;

