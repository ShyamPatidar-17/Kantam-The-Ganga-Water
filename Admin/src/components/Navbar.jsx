import React from 'react';
import { 
  Bell, 
  User, 
  LogOut, 
  LogIn, 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Users, 
  MenuIcon,
  Droplets,
  UserCircle // Added for the profile link
} from 'lucide-react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    <nav className="h-20 bg-slate-900 text-white flex items-center justify-between px-8 sticky top-0 z-[100] shadow-2xl border-b border-white/5">
      
      {/* --- Left Side: Brand --- */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <Droplets size={20} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="text-xl font-black tracking-tighter uppercase text-white">Kantam</h1>
            <span className="text-[8px] font-bold tracking-[0.3em] text-blue-400 uppercase">Management</span>
          </div>
        </div>

        {/* --- Center: Desktop Navigation --- */}
        <div className="hidden lg:flex items-center gap-1 ml-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* --- Right Side: User Actions --- */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-5">
            {/* User Profile Info - Now Clickable to go to Profile */}
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 border-r border-white/10 pr-5 cursor-pointer group hover:opacity-80 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white leading-none">
                  {user.fullName || user.name}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-blue-400 mt-1">
                  {user.role} Identity
                </p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl text-blue-400 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <User size={18} />
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="group p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;