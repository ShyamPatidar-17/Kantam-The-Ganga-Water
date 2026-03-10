import React, { useState } from 'react'; // Added useState
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, ChevronLeft, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  // Destructure clearCart from your context
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  if (cart.length === 0) {
    // ... (Your existing empty state remains the same)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 px-6">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm text-center max-w-sm border border-slate-100">
            <div className="relative mb-6 inline-block">
                <ShoppingBag size={64} className="text-slate-200" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-200"></div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Bag is Empty</h2>
            <p className="text-slate-400 text-[10px] mt-2 mb-8 tracking-[0.2em] uppercase font-bold">Your selection stream is currently dry.</p>
            <Link to="/" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Go to Source <ArrowRight size={14} />
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 font-body relative">
      
      {/* --- CONFIRMATION POPUP --- */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full border border-slate-100 text-center scale-in-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Empty Bag?</h3>
            <p className="text-slate-400 text-[10px] mt-2 mb-8 tracking-widest uppercase font-bold">This will remove all reserved items from your current session.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  clearCart();
                  setShowConfirm(false);
                }}
                className="py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-2 uppercase text-[9px] font-black tracking-[0.2em]">
                    <ChevronLeft size={12} strokeWidth={3} /> Return
                </button>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">My <span className="text-blue-600 italic font-light">Bag</span></h1>
            </div>
            <div className="text-right flex flex-col items-end">
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="mb-3 text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-2 transition-colors group"
                >
                  <Trash2 size={10} className="group-hover:rotate-12 transition-transform"/> Clear Entire Bag
                </button>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserved Items</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{cart.length}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* List of Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-[2.5rem] flex flex-col sm:flex-row gap-8 items-center border border-slate-100/50 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-32 h-32 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 p-4 transition-transform group-hover:scale-105 duration-500">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">{item.name}</h3>
                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-6 px-2 py-0.5 bg-blue-50 inline-block rounded-md">{item.size}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 shadow-inner">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-slate-400 hover:text-blue-600 transition-colors"><Minus size={14} strokeWidth={3}/></button>
                      <span className="text-sm font-black w-4 text-center tabular-nums text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-slate-400 hover:text-blue-600 transition-colors"><Plus size={14} strokeWidth={3}/></button>
                    </div>
                    <p className="font-black text-xl tracking-tighter text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Checkout Summary */}
          <div className="lg:col-span-4 sticky top-32">
             {/* ... (Rest of your summary UI) */}
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> Payment Summary
              </h3>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtotal</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping</span>
                  <span className="text-[10px] font-black uppercase text-emerald-500 px-2 py-1 bg-emerald-50 rounded-lg">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Final Total</span>
                    <span className="text-4xl font-black text-blue-600 tracking-tighter">₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="group w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-100"
              >
                Checkout <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;