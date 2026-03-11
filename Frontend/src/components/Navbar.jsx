import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Droplets, Menu, LogOut, LogIn, X, ChevronRight } from 'lucide-react';
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
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-0' : 'py-2'}`}>
        <div className={`max-w-full mx-auto flex justify-between items-center px-6 md:px-12 py-4 transition-all duration-500 border-b ${
          isScrolled || !isHome
            ? 'bg-slate-900/95 backdrop-blur-md border-white/10 shadow-xl' 
            : 'bg-slate-900 border-slate-800 shadow-2xl'
        }`}>
          
          {/* --- Logo Block --- */}
          <Link to="/" className="flex flex-col leading-none group text-white relative z-[110]">
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-400 group-hover:scale-110 transition-transform" size={22} />
              <span className="text-xl md:text-2xl font-black tracking-tighter">KANTAM</span>
            </div>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400/80 ml-7 md:ml-8">
              The Ganga Water
            </span>
          </Link>
          
          {/* --- Desktop Navigation --- */}
          <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            {['Home', 'Collection', 'Our Story'].map((label) => (
              <Link key={label} to={label === 'Home' ? '/' : `/${label.toLowerCase().replace(' ', '')}`} className="hover:text-blue-400 transition-colors">
                {label}
              </Link>
            ))}
            {isLoggedIn && <Link to="/orders" className="hover:text-blue-400 transition-colors">My Orders</Link>}
          </div>

          {/* --- Action Center --- */}
          <div className="flex items-center gap-4 md:gap-6 text-white relative z-[110]">
            <div className="hidden sm:flex items-center gap-4 border-r border-white/10 pr-4 md:pr-6">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="hover:text-blue-400 transition-all flex items-center gap-2">
                    <User size={18} />
                    <span className="hidden xl:inline text-[9px] font-black uppercase tracking-widest">Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <LogIn size={18} />
                  <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Login</span>
                </Link>
              )}
            </div>
            
            <Link to="/cart" className="relative hover:text-blue-400 transition-all flex items-center group p-2">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 bg-blue-400 text-slate-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:text-blue-400 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* --- Floating Side Drawer (Mobile Only) --- */}
        <div className={`
          lg:hidden fixed top-[76px] right-4 w-64 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ease-out z-[105] overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-10 opacity-0 invisible'}
        `}>
          <div className="p-4 flex flex-col gap-1">
            <MobileNavLink to="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/collection" label="Collection" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/about" label="Our Story" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="h-px bg-white/5 my-2" />

            {isLoggedIn ? (
              <>
                <MobileNavLink to="/orders" label="My Orders" onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/profile" label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full px-4 py-3 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <span>Logout</span>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link to="/login" className="bg-blue-500 text-slate-900 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Login</Link>
                <Link to="/signup" className="border border-white/20 text-white text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

// Helper component for mobile links
const MobileNavLink = ({ to, label, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center justify-between px-4 py-3 text-white/70 hover:text-blue-400 hover:bg-white/5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest group"
  >
    <span>{label}</span>
    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
  </Link>
);

export default Navbar;