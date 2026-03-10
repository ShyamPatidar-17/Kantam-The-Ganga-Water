import React from 'react';
import { Instagram, Mail, Phone, Droplets, ExternalLink, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('User'));
  const isAdmin = user?.role === 'Admin' || user?.role === 'Seller';

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 px-6 mt-0 w-full mt-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
        
        {/* --- Brand Identity --- */}
        <div className="flex flex-col leading-none group">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <Droplets className="text-brand-accent group-hover:animate-pulse" size={20} />
            <span className="text-xl font-black tracking-tighter">KANTAM</span>
          </Link>
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-accent/60 ml-7">
            The Ganga Water
          </span>
        </div>

        {/* --- Quick Navigation --- */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest text-white/40">
          <Link to="/collection" className="hover:text-brand-accent transition-colors">Collection</Link>
          <Link to="/about" className="hover:text-brand-accent transition-colors">Story</Link>
          <Link to="/orders" className="hover:text-brand-accent transition-colors">Orders</Link>
          {isAdmin && (
            <Link to="/admin/orders" className="text-brand-accent flex items-center gap-1 hover:brightness-125">
              Admin <ExternalLink size={10} />
            </Link>
          )}
        </div>

        {/* --- Social Actions --- */}
        <div className="flex items-center gap-3">
          <SocialLink href="https://www.instagram.com/kantam_the_ganga_premium_water" icon={<Instagram size={16} />} />
          <SocialLink href="mailto:Kantamthegangawater01@gmail.com" icon={<Mail size={16} />} />
          <SocialLink href="tel:6265859281" icon={<Phone size={16} />} />
        </div>
      </div>

      {/* --- Highlighted Developer Credits --- */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/20">
          © 2026 KANTAM PREMIUM WATER. RADHE RADHE.
        </p>
        
        {/* SHYAM PATIDAR HIGHLIGHTED BLOCK */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-wrap justify-center items-center gap-x-6 gap-y-3 bg-slate-800/50 px-6 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-brand-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Architected by <span className="text-brand-accent brightness-125 underline decoration-brand-accent/30 underline-offset-4">Shyam Patidar</span>
              </span>
            </div>
            
            <div className="flex items-center gap-5">
              <a href="mailto:shyampatidar916@gmail.com" className="text-[9px] font-bold text-white/70 hover:text-brand-accent transition-all flex items-center gap-1.5 uppercase tracking-widest">
                <Mail size={12} className="text-brand-accent" /> Email
              </a>
              <a href="tel:7354727368" className="text-[9px] font-bold text-white/70 hover:text-brand-accent transition-all flex items-center gap-1.5 uppercase tracking-widest">
                <Phone size={12} className="text-brand-accent" /> +91 73547 27368
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full border border-white/5 hover:bg-brand-accent hover:text-slate-900 hover:border-brand-accent transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;