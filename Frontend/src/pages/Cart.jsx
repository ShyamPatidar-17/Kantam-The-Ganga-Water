import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Assume you have a Cart Context

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <ShoppingBag size={80} className="text-slate-100 mb-6" strokeWidth={1} />
        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Your bag is empty</h2>
        <p className="text-slate-400 text-sm mt-2 mb-8">The source is waiting for your selection.</p>
        <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-brand-accent hover:text-brand-primary transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-12">Your <span className="text-brand-accent italic font-light">Selection</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* List of Items */}
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-6 pb-8 border-b border-slate-50 items-center">
                <div className="w-24 h-32 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 p-4">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">{item.name}</h3>
                    <button onClick={() => removeFromCart(item._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.size}</p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-full px-4 py-2">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="hover:text-brand-accent"><Minus size={14}/></button>
                      <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="hover:text-brand-accent"><Plus size={14}/></button>
                    </div>
                    <p className="font-black text-lg">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 rounded-[3rem] p-10 h-fit sticky top-32">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-green-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6 mb-10 flex justify-between items-baseline">
              <span className="font-black uppercase text-xs">Total</span>
              <span className="text-4xl font-black">₹{getCartTotal()}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-xl"
            >
              Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;