import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, ShieldCheck, Waves, Loader2, Sparkles } from 'lucide-react';


import { fetchAllProducts } from '../api'; 
import images from '../assets/index';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchAllProducts();
        setProducts(data.slice(0, 3)); // Only show top 3 for a cleaner look
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="bg-white text-slate-900 selection:bg-brand-accent">
      
      {/* --- Section 1: Minimal High-Impact Hero --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="z-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={16} className="text-brand-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Pure Himalayan Source</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8">
              KANTAM<br/>
              <span className="text-brand-accent italic font-light drop-shadow-sm">The Ganga</span>
            </h1>
            
            <p className="text-slate-500 text-lg max-w-md mb-10 font-light leading-relaxed">
              Sourced from the eternal springs of the high Himalayas. 
              Pure, sacred, and systematically bottled at the source.
            </p>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/collection')}
                className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-slate-900 transition-all duration-500 flex items-center gap-4 group"
              >
                Shop Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Featured Visual Block */}
          <div className="relative flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-[4rem] shadow-2xl overflow-hidden border-[12px] border-white">
               <img 
                 src={images.All || "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1974"} 
                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]" 
                 alt="Kantam Product" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
               <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Coordinates</p>
                  <p className="text-xs font-bold tracking-widest">30.99° N, 79.12° E</p>
               </div>
            </div>
            {/* Background Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Product Showcase (Compact) --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Featured <span className="text-brand-accent italic font-light">Drops</span></h2>
              <p className="text-slate-400 text-sm mt-2">Limited batches. Sacred origin.</p>
            </div>
            <button onClick={() => navigate('/collection')} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-brand-accent pb-1 hover:text-brand-accent transition-colors">
              Explore All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-accent" size={32} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((item) => (
                <div key={item._id} className="group relative bg-slate-50 rounded-[3rem] p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100">
                  <div className="aspect-square mb-6 flex items-center justify-center relative">
                    <img 
                      src={item.images?.[0] || images.ltr1} 
                      className="h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      alt={item.name}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-brand-accent uppercase tracking-[0.2em] mb-1">{item.size}</p>
                      <h4 className="text-xl font-black uppercase tracking-tighter">{item.name}</h4>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-brand-accent hover:text-slate-900 transition-all shadow-lg active:scale-95"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Section 3: Trust Pillars (Small Footer) --- */}
      <section className="bg-slate-900 text-white py-20 px-6 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <Pillar icon={<ShieldCheck className="text-brand-accent" />} title="Certified Purity" desc="Lab tested at every stage." />
          <Pillar icon={<Waves className="text-brand-accent" />} title="Sacred Origin" desc="Direct from Ganga sources." />
          <Pillar icon={<ArrowRight className="text-brand-accent" />} title="Quick COD" desc="Pay when purity arrives." />
        </div>
      </section>
    </div>
  );
};

const Pillar = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center">
    <div className="mb-4">{icon}</div>
    <h4 className="text-xs font-black uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-slate-400 text-xs font-light">{desc}</p>
  </div>
);

export default Home;