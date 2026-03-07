import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Filter, Loader2, Droplets, X, Sparkles, MoveRight } from 'lucide-react';
import { API_URL } from '../App';
import images from '../assets/index';
import { useCart } from '../context/CartContext'; 

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSize, setActiveSize] = useState("All");
  const { addToCart } = useCart();

  const sizes = ["All", "250ml", "500ml", "1ltr", "2ltr", "10ltr"];

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products`);
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeSize !== "All") result = result.filter(p => p.size === activeSize);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredProducts(result);
  }, [search, activeSize, products]);

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 px-6">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- Minimalist Header --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[1px] bg-brand-accent"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-accent">Himalayan Source</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-heading font-black text-brand-primary tracking-tighter leading-[0.8] uppercase mb-8">
              Sacred <br /> <span className="italic font-light text-slate-200 group-hover:text-brand-accent transition-colors">Vessels</span>
            </h1>
          </div>
          <div className="lg:max-w-sm text-right">
            <p className="text-stone-400 font-light text-sm md:text-base leading-relaxed mb-6">
               Filtered through ancient stone, bottled at the source of eternity. Explore the full Kantam collection.
            </p>
            <div className="flex justify-end gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{filteredProducts.length} Results</span>
            </div>
          </div>
        </div>

        {/* --- Refined Control Hub --- */}
        <div className="sticky top-28 z-40 mb-20">
          <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-full p-2 flex flex-col md:flex-row items-center gap-4 shadow-2xl shadow-slate-200/50">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="text"
                placeholder="Search collection..."
                className="w-full pl-16 pr-10 py-4 bg-transparent rounded-full outline-none text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-4 w-full md:w-auto">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeSize === size 
                    ? 'bg-brand-primary text-white shadow-lg' 
                    : 'text-stone-400 hover:text-brand-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Product Grid --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-brand-accent mb-4" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col h-full">
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative aspect-[4/5] bg-[#fcfcfc] rounded-[3rem] overflow-hidden transition-all duration-1000 group-hover:bg-[#f3f3f3]">
                  <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center p-12">
                    <img 
                      src={product.images?.[0] || images.ltr1} 
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                  </Link>
                  
                  {/* Status Badges */}
                  <div className="absolute top-8 left-8">
                     <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">{product.size}</span>
                     </div>
                  </div>
                  
                  {product.stock < 5 && (
                    <div className="absolute top-8 right-8">
                       <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                          <span className="text-[8px] font-black uppercase tracking-widest">Rare</span>
                       </div>
                    </div>
                  )}

                  {/* Quick Add Overlay (Appears on Hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-accent hover:text-brand-primary transition-colors"
                      >
                         Add to Cart
                      </button>
                  </div>
                </div>

                {/* Info Section - Aligned and Spaced */}
                <div className="mt-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <Link to={`/product/${product._id}`}>
                        <h3 className="text-2xl font-black text-brand-primary uppercase tracking-tighter hover:text-brand-accent transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="text-xl font-black text-brand-primary italic">₹{product.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">In Stock: {product.stock}</span>
                    <Link to={`/product/${product._id}`} className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2 group/link">
                       View Vessel <MoveRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Empty State --- */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-60">
             <h2 className="text-4xl font-black text-slate-100 uppercase italic">Source Empty</h2>
             <button onClick={() => {setSearch(""); setActiveSize("All")}} className="mt-8 text-xs font-black uppercase tracking-widest border-b-2 border-brand-accent pb-1">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;