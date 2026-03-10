import React, { useEffect, useState } from 'react';
import { Loader2, Package, Calendar, Droplets, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchMyOrders, cancelOrder } from '../api/index'; 

import Navbar from '../components/Navbar';


const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // 2. Refactored Fetch Logic
  const getOrderHistory = async () => {
    try {
      const { data } = await fetchMyOrders();
      // Sort: Newest first
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (err) {
      toast.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  // 3. Refactored Cancellation Logic
  const confirmCancellation = async () => {
    if (!selectedOrderId) return;
    
    const loadingToast = toast.loading("Processing cancellation...");
    try {
      // Use the centralized API call
      const response = await cancelOrder(selectedOrderId);
      
      if (response.status === 200) {
        toast.success("Radhe Radhe! Order cancelled.", { id: loadingToast });
        setShowCancelPopup(false);
        getOrderHistory(); // Refresh list
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Cancellation failed";
      toast.error(msg, { id: loadingToast });
      setShowCancelPopup(false);
    }
  };


  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading History...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32 relative">

      {/* --- CUSTOM CANCELLATION POPUP --- */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelPopup(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Radhe Radhe</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
              Are you sure you want to cancel this sacred delivery? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmCancellation}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Yes, Cancel Order
              </button>
              <button 
                onClick={() => setShowCancelPopup(false)}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-40 px-6">
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Droplets size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Account History</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            My <span className="text-blue-600 italic font-light">Journey</span>
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto text-slate-100 mb-6" size={60} strokeWidth={1} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No vessels logged</p>
          </div>
        ) : (
          <div className="space-y-24">
            {orders.map((order) => (
              <div key={order._id} className="relative group">
                {/* Header Meta */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">#${order._id.slice(-6).toUpperCase()}</span>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                      order.status === 'Cancelled' ? 'bg-slate-100 text-slate-400' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                  <div className="space-y-8">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6">
                        <div className="w-16 h-20 bg-slate-50 rounded-2xl p-2 flex items-center justify-center group-hover:bg-blue-50/50 transition-colors">
                          <img src={item.bottleId?.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" alt="vessel" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase">{item.bottleId?.name || "Sacred Vessel"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{item.size} • Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-end items-end text-right">
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-bold text-slate-300 uppercase italic">
                    Shipping to: {order.shippingAddress?.street}
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setShowCancelPopup(true);
                      }}
                      className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 group/btn"
                    >
                      <XCircle size={12} /> Cancel Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;