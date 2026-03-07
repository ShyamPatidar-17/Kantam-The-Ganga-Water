import React from 'react';
import { Instagram, Mail, Phone, Droplets, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Admin' || user?.role === 'Seller';

  return (
    // Reduced top padding from pt-20 to pt-12 and mt-20 to mt-12
    <footer className="bg-brand-primary text-white pt-12 pb-6 px-6 mt-12 rounded-[3rem_3rem_0_0]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/5 pb-10">
        
        {/* Brand Identity */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="text-brand-accent" size={24} />
            <span className="text-xl font-black tracking-widest">KANTAM</span>
          </div>
          <p className="text-white/40 font-light text-sm leading-relaxed max-w-xs">
            Preserving the sacred essence of the Ganga, delivered in its purest form to you.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h5 className="font-black mb-4 text-brand-accent uppercase tracking-[0.3em] text-[9px]">Explore</h5>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-white/50 text-xs font-medium">
            <li><Link to="/collection" className="hover:text-brand-accent transition-colors">Collection</Link></li>
            <li><Link to="/about" className="hover:text-brand-accent transition-colors">Our Story</Link></li>
            <li><Link to="/orders" className="hover:text-brand-accent transition-colors">Orders</Link></li>
            {isAdmin && (
              <li>
                <Link to="/admin/orders" className="text-brand-accent hover:brightness-125 transition-all">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Contact & Social - Made more compact */}
        <div className="flex flex-col justify-center gap-3">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/kantam_the_ganga_premium_water" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all">
              <Instagram size={18} />
            </a>
            <a href="mailto:Kantamthegangawater01@gmail.com" className="p-2 bg-white/5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all">
              <Mail size={18} />
            </a>
            <a href="tel:6265859281" className="p-2 bg-white/5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-all">
              <Phone size={18} />
            </a>
          </div>
          <p className="text-[10px] text-white/30 font-bold tracking-widest">CONNECT AT SOURCE</p>
        </div>
      </div>

      {/* Bottom Bar - Reduced padding from pt-10 to pt-6 */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
         © 2026 KANTAM PREMIUM WATER. ALL RIGHTS RESERVED.
        </p>
        
        <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
          <span>Designed & Developed by:</span>
          <a href="mailto:shyampatidar916@gmail.com" className="text-brand-accent hover:text-white border-b border-brand-accent/30">
            Shyam Patidar
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;