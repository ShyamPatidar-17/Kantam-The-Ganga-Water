import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, ShieldCheck, Wind, Loader2, Sparkles, Layers } from 'lucide-react';
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
        // Keep 4 products for the background visual but focus on the CTA
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-brand-surface font-body text-brand-primary selection:bg-brand-accent selection:text-brand-primary">
      
      {/* --- Section 1: Immersive Hero --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <video 
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src="https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-mountain-stream-4433-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/90 via-brand-primary/40 to-brand-surface"></div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-top-10 duration-1000">
            <span className="h-[1px] w-12 bg-brand-accent/50"></span>
            <span className="text-brand-accent font-black tracking-[0.6em] text-[10px] md:text-xs uppercase">Purity Redefined</span>
            <span className="h-[1px] w-12 bg-brand-accent/50"></span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-heading font-black text-white mb-10 leading-[0.85] tracking-tighter drop-shadow-2xl">
            KANTAM <br/> 
            <span className="italic font-extralight text-brand-accent brightness-125">The Source</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/collection')}
              className="group relative bg-brand-accent text-brand-primary px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <a href="#philosophy" className="text-white/70 hover:text-brand-accent text-xs font-black uppercase tracking-widest transition-colors border-b border-white/20 pb-1">
              Our Philosophy
            </a>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-[1px] h-16 bg-gradient-to-b from-brand-accent to-transparent"></div>
        </div>
      </section>

      {/* --- Section 2: Premium Philosophy --- */}
      <section id="philosophy" className="py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] group">
              <img src={images.All || "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=2000"} className="w-full h-[700px] object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt="Sacred Source" />
              <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay"></div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-accent rounded-full blur-[80px] opacity-30 animate-pulse"></div>
          </div>

          <div className="lg:pl-10 order-1 lg:order-2">
            <h2 className="text-6xl md:text-8xl font-heading font-black mb-12 text-brand-primary leading-[0.9] tracking-tighter">
              A Vessel for the <br/>
              <span className="text-brand-accent italic font-light">Soul's Thirst</span>
            </h2>
            <div className="space-y-12">
               <ValueItem 
                icon={<ShieldCheck size={28} />} 
                title="Sacred Purity" 
                desc="Bottled at the precise coordinates where the air meets the eternal springs of the high Himalayas." 
               />
               <ValueItem 
                icon={<Layers size={28} />} 
                title="Crystal Structure" 
                desc="Unique hexagonal water molecules preserved through zero-vibration transport technology." 
               />
               <button 
                 onClick={() => navigate('/collection')}
                 className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] hover:text-brand-accent transition-colors group"
               >
                 View All Products <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Visual Showcase --- */}
      <section className="py-40 px-6 bg-brand-primary text-white rounded-[6rem_6rem_0_0] relative z-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tighter">Purely <span className="text-brand-accent">Himalayan</span></h2>
          <p className="text-white/40 max-w-xl mx-auto mb-24 font-light text-lg">Every drop tells a thousand-year story of mountain stone and sky.</p>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-brand-accent" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((item) => (
                <div key={item._id} className="group p-4 bg-white/5 rounded-[3.5rem] border border-white/10 hover:bg-white/10 hover:border-brand-accent/40 transition-all duration-700">
                  <Link to={`/product/${item._id}`} className="block aspect-[4/5] bg-brand-surface/10 rounded-[2.5rem] overflow-hidden mb-8 p-10 relative">
                    <img 
                      src={item.images?.[0] || images.ltr1} 
                      className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700" 
                      alt={item.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                  <div className="px-4 pb-4 flex justify-between items-end">
                    <div className="text-left">
                      <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-1">{item.size}</p>
                      <h4 className="text-xl font-bold uppercase tracking-tighter">{item.name}</h4>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-brand-accent text-brand-primary p-4 rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-32">
            <button 
              onClick={() => navigate('/collection')}
              className="bg-transparent border-2 border-white/20 text-white px-16 py-6 rounded-full font-black text-xs uppercase tracking-widest hover:border-brand-accent hover:text-brand-accent transition-all duration-500"
            >
              Enter The Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ValueItem = ({ icon, title, desc }) => (
  <div className="flex gap-8 items-start group">
    <div className="p-6 bg-slate-50 rounded-[2rem] text-brand-primary shadow-sm group-hover:bg-brand-accent group-hover:text-brand-primary group-hover:-rotate-12 transition-all duration-700">
      {icon}
    </div>
    <div>
      <h4 className="text-2xl font-black text-brand-primary mb-3 uppercase tracking-tighter">{title}</h4>
      <p className="text-stone-500 font-light text-base leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Home;