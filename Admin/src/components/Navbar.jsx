import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  LogIn, 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  MenuIcon,
  Droplets,
  X, 
  Menu 
} from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { path: '/addItem', label: 'Add Product', icon: <PlusCircle size={16} /> },
    { path: '/my-inventory', label: 'Inventory', icon: <MenuIcon size={16} /> },
    { path: '/orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { path: '/users', label: 'Customers', icon: <Users size={16} /> },
  ];

  return (
    <div className="relative">
      <nav className="h-20 bg-slate-900 text-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-[100] shadow-2xl border-b border-white/5">
        
        {/* --- Left Side: Brand & Mobile Toggle --- */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Droplets size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase text-white">Kantam</h1>
              <span className="text-[8px] font-bold tracking-[0.3em] text-blue-400 uppercase">Management</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 ml-10">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* --- Right Side: User Actions --- */}
        <div className="flex items-center gap-2 md:gap-6">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div onClick={() => navigate('/profile')} className="flex items-center gap-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-white leading-none">{user.fullName || user.name}</p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={16} />
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* --- Mobile Floating Sidebar --- */}
      {/* This container only shows on mobile (lg:hidden). 
          It slides in from the left and takes up only the height of the content.
      */}
      <div className={`
        lg:hidden fixed top-20 left-4 z-[90] w-64 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ease-out overflow-hidden
        ${isMenuOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-10 opacity-0 invisible'}
      `}>
        <div className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
          
          {/* Visual Divider in Sidebar */}
          <div className="h-px bg-white/5 my-2" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;