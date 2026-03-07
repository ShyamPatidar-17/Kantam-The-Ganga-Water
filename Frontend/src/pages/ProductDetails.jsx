import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ShieldCheck, Droplets, Loader2, Mail, PhoneCall } from 'lucide-react';
import { API_URL } from '../App';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
// 1. Import the useCart hook
import { useCart } from '../context/CartContext'; 

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  // 2. Destructure the addToCart function
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products/particular/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error("Vessel data could not be retrieved");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Analyzing Source Purity...</span>
    </div>
  );

  if (!product) return <div className="p-20 text-center font-black uppercase text-slate-400">Vessel not found at source.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-40 pb-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in fade-in duration-700">
        
        {/* --- Image Gallery Section --- */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-[3rem] overflow-hidden shadow-2xl aspect-square flex items-center justify-center p-12 border border-slate-100">
            <img 
              src={product.images[selectedImg]} 
              alt={product.name} 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" 
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImg(i)} 
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 bg-slate-50 ${
                  selectedImg === i ? 'border-brand-accent scale-95 shadow-lg' : 'border-transparent hover:border-slate-200'
                }`}
              >
                <img src={img} className="h-full w-full object-contain" alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* --- Product Info Section --- */}
        <div className="py-6 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-[10px] font-black text-brand-accent bg-brand-accent/10 px-4 py-2 rounded-full uppercase tracking-widest">
              Natural Alkaline {product.size}
            </span>
          </div>

          <h1 className="text-6xl font-heading font-black text-brand-primary mb-4 tracking-tighter uppercase">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-4xl font-black text-brand-primary">₹{product.price}</p>
            <span className="text-stone-300 text-sm font-bold uppercase tracking-widest">Inclusive of taxes</span>
          </div>

          <p className="text-stone-500 text-lg mb-12 leading-relaxed font-light">
            {product.description || "Ethically harvested from the pristine depths of the Himalayan springs. This sacred water undergoes a natural filtration process through layers of mineral-rich rock."}
          </p>
          
          <div className="flex gap-4 mb-12">
            {/* 3. Updated Button to call addToCart */}
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-brand-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
            >
              <ShoppingCart size={20} /> Add to Collection
            </button>
          </div>

          {/* laboratory/pH Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-slate-100">
            <div className="flex gap-4 items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <ShieldCheck size={20} className="text-brand-accent" />
              </div>
              Laboratory Certified
            </div>
            <div className="flex gap-4 items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <Droplets size={20} className="text-brand-accent" />
              </div>
              pH Balanced (8.2+)
            </div>
          </div>

          {/* --- Catchy Customized Packaging Note --- */}
          <div className="mt-12 p-8 bg-brand-primary rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-4 -bottom-4 bg-brand-accent w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-accent mb-3">
              Corporate & Special Events
            </h4>
            <p className="text-lg font-medium leading-snug mb-6">
              Elevate your firm’s presence with <span className="text-brand-accent italic">Bespoke Packaging</span> tailored to your brand identity.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <a href="tel:+916265859281" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-brand-accent transition-colors">
                <PhoneCall size={14} /> Call: +91 6265859281
              </a>
              <a href="mailto:contact@kantam.com" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-brand-accent transition-colors">
                <Mail size={14} /> Email us
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;