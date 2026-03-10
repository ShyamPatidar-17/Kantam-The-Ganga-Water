import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Loader2, MoveRight, Droplets, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext'; 
import { fetchAllProducts } from '../api';

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
      
      // Use your central API helper
      const response = await fetchAllProducts();
      
      // Since your interceptor returns the full response, 
      // we check for response.data
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
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-body text-slate-900 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Brand Header Section --- */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-bounce">
             <Droplets size={18} className="text-blue-600" />
          </div>
          
          <div className="relative inline-block mb-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-2">
              KANTAM
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="h-[1px] w-8 bg-blue-200"></span>
              <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.5em] text-blue-600/80">
                The Ganga Water
              </span>
              <span className="h-[1px] w-8 bg-blue-200"></span>
            </div>
          </div>
          
          <p className="text-slate-400 max-w-lg mx-auto text-[10px] md:text-xs font-black uppercase tracking-[0.2em] leading-relaxed">
            Radhe Radhe! Explore the sacred vessels, <br/> 
            bottled with purity at the Himalayan source.
          </p>
        </div>

        {/* --- Floating Systematic Filter --- */}
        <div className="sticky top-24 z-50 flex justify-center mb-20 px-4">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-full px-6 py-2 flex items-center gap-4 shadow-2xl shadow-blue-900/5">
            <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Search collection..."
                className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-32 md:w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setActiveSize(size)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeSize === size ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'
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
            <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Fetching Purity...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col">
                
                {/* Product Frame */}
                <div className="aspect-square bg-slate-50 rounded-[3rem] overflow-hidden transition-all duration-700 group-hover:bg-blue-50/40 flex items-center justify-center p-12 relative border border-transparent group-hover:border-blue-100">
                  <Link to={`/product/${product._id}`} className="w-full h-full">
                    <img 
                      src={product.images?.[0]} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 ease-out mix-blend-multiply"
                    />
                  </Link>
                  
                  {/* Action Badge */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-8 right-8 bg-white text-slate-900 p-4 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-blue-600 hover:text-white active:scale-90"
                  >
                    <ShoppingCart size={20} />
                  </button>

                  <div className="absolute top-8 left-8 flex items-center gap-2">
                    <Sparkles size={12} className="text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{product.size}</span>
                  </div>
                </div>

                {/* Info Metadata */}
                <div className="mt-8 flex justify-between items-start px-4">
                  <div className="max-w-[70%]">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">In Stock: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 italic">₹{product.price}</p>
                    <Link to={`/product/${product._id}`} className="text-[8px] font-black uppercase tracking-widest text-blue-500 flex items-center justify-end gap-1 mt-2 hover:translate-x-1 transition-transform">
                      Details <MoveRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Empty Result State --- */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-40">
            <h2 className="text-3xl font-black text-slate-200 uppercase tracking-tighter italic">Source Currently Empty</h2>
            <button 
              onClick={() => {setSearch(""); setActiveSize("All")}} 
              className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;