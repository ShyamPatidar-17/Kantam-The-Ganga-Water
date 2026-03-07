import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ShoppingBag, Users, LogOut,MenuIcon } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/addItem', label: 'Add Product', icon: <PlusCircle size={20} /> },
     {path:'/my-inventory', label:'My Products',icon:<MenuIcon size={20}/>},
    { path: '/orders', label: 'View Orders', icon: <ShoppingBag size={20} /> },
    { path: '/users', label: 'Customers', icon: <Users size={20} /> },
   
  ];

  return (
    <aside className="w-64 bg-slate-900 min-h-screen text-white flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">💧</div>
        <h1 className="text-xl font-black tracking-widest uppercase text-white">Kantam</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition-colors rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;