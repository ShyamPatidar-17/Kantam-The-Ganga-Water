import React from 'react';
import { Bell, User, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload(); // Ensures app state is reset
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
      {/* Brand/Logo Area (Left) */}
      <div className="flex items-center">
        <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          Kantam<span className="text-blue-600">.</span>
        </h2>
      </div>
      
      {/* Right Side Actions */}
      <div className="flex items-center gap-6">

        <div className="flex items-center gap-4 border-l pl-6">
          {user ? (
            <>
              {/* User Info */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">
                  {user.fullName || user.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-1">
                  {user.role} Account
                </p>
              </div>

              {/* User Avatar */}
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600 border border-blue-100">
                <User size={20} />
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 ml-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            /* Login Button (If no user) */
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;