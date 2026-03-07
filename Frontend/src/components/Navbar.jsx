import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Droplets, Menu, LogOut, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
// 1. Import the useCart hook
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 2. Access getCartCount from your context
  const { getCartCount } = useCart();
  
  const isLoggedIn = !!localStorage.getItem('token'); 
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Also clear user data
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled || !isHome ? 'py-0' : 'py-2' 
      }`}
    >
      <div className={`max-w-full mx-auto flex justify-between items-center px-6 md:px-12 py-4 transition-all duration-500 border-b ${
        isHome 
          ? isScrolled 
            ? 'bg-brand-primary/95 backdrop-blur-md border-white/10 shadow-xl' 
            : 'bg-transparent border-transparent'
          : 'bg-brand-primary border-brand-primary shadow-2xl'
      }`}>
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-2 group text-white">
          <Droplets className="text-brand-accent group-hover:animate-bounce" size={26} />
          <span className="text-2xl font-black tracking-widest">KANTAM</span>
        </Link>
        
        {/* --- Desktop Links --- */}
        <div className="hidden lg:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          <Link to="/" className="hover:text-brand-accent transition-colors">Home</Link>
          <Link to="/collection" className="hover:text-brand-accent transition-colors">Our Products</Link>
          <Link to="/about" className="hover:text-brand-accent transition-colors">Our Story</Link>
          {isLoggedIn && (
            <Link to="/orders" className="hover:text-brand-accent transition-colors">My Orders</Link>
          )}
        </div>

        {/* --- Action Icons --- */}
        <div className="flex items-center gap-5 md:gap-8 text-white">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-brand-accent transition-all flex items-center gap-2">
                <User size={20} />
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-widest">Profile</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="hover:text-red-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-accent flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/signup" className="bg-brand-accent text-brand-primary px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
                SignUp
              </Link>
            </>
          )}
          
          <Link to="/cart" className="relative hover:text-brand-accent transition-all flex items-center gap-2 group">
            <ShoppingCart size={20} />
            {/* 3. Render the dynamic count here */}
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-accent text-brand-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-primary animate-in zoom-in duration-300">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          <button className="lg:hidden hover:text-brand-accent transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;