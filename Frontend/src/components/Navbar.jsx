import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Droplets, Menu, LogOut, LogIn, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { getCartCount } = useCart();
  
  const isLoggedIn = !!localStorage.getItem('token'); 
  const isHome = location.pathname === "/";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Radhe Radhe! Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          isScrolled ? 'py-0' : 'py-2' 
        }`}
      >
        <div className={`max-w-full mx-auto flex justify-between items-center px-6 md:px-12 py-4 transition-all duration-500 border-b ${
          isScrolled || !isHome
            ? 'bg-slate-900/95 backdrop-blur-md border-white/10 shadow-xl' 
            : 'bg-slate-900 border-slate-800 shadow-2xl'
        }`}>
          
          {/* --- Logo Block --- */}
          <Link to="/" className="flex flex-col leading-none group text-white relative z-[110]">
            <div className="flex items-center gap-2">
              <Droplets className="text-brand-accent group-hover:scale-110 transition-transform" size={22} />
              <span className="text-xl md:text-2xl font-black tracking-tighter">KANTAM</span>
            </div>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-brand-accent/80 ml-7 md:ml-8">
              The Ganga Water
            </span>
          </Link>
          
          {/* --- Desktop Navigation --- */}
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
            <Link to="/collection" className="hover:text-brand-accent transition-colors">Collection</Link>
            <Link to="/about" className="hover:text-brand-accent transition-colors">Our Story</Link>
            {isLoggedIn && (
              <Link to="/orders" className="hover:text-brand-accent transition-colors">My Orders</Link>
            )}
          </div>

          {/* --- Action Center --- */}
          <div className="flex items-center gap-4 md:gap-6 text-white relative z-[110]">
            <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-4 md:pr-6">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="hover:text-brand-accent transition-all flex items-center gap-2">
                    <User size={18} />
                    <span className="hidden xl:inline text-[9px] font-black uppercase tracking-widest">Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 hover:text-brand-accent transition-colors">
                  <LogIn size={18} />
                  <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Login</span>
                </Link>
              )}
            </div>
            
            {/* --- Cart Block --- */}
            <Link to="/cart" className="relative hover:text-brand-accent transition-all flex items-center group p-2">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-brand-accent text-slate-900 text-[9px] font-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-in zoom-in duration-300">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {/* --- Mobile Menu Toggle --- */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:text-brand-accent transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- Mobile Drawer --- */}
        <div className={`fixed inset-0 bg-slate-900 transition-transform duration-500 z-[105] lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 text-white uppercase font-black tracking-[0.3em] text-sm">
            <Link to="/" className="hover:text-brand-accent">Home</Link>
            <Link to="/collection" className="hover:text-brand-accent">Collection</Link>
            <Link to="/about" className="hover:text-brand-accent">Our Story</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/orders" className="hover:text-brand-accent">My Orders</Link>
                <Link to="/profile" className="hover:text-brand-accent">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-400 mt-4 border border-red-400/30 px-8 py-3 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 w-full px-12 mt-4">
                <Link to="/login" className="bg-white text-slate-900 text-center py-4 rounded-xl">Login</Link>
                <Link to="/signup" className="border border-white text-center py-4 rounded-xl">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;