import React from 'react';
import { Mail, Phone, MapPin, Globe, Code2, ExternalLink } from 'lucide-react';
import images from '../assets/index';

const About = () => (
  <div className="min-h-screen bg-brand-surface font-body selection:bg-brand-accent selection:text-brand-primary">
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
      <h1 className="text-6xl font-heading font-black text-brand-primary mb-8 tracking-tighter">
        The Spirit of Ganga
      </h1>
      <p className="text-xl text-stone-500 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
        Kantam brings the essence of Himalayan purity directly to your modern lifestyle. 
        Visit our regional branches for offline purchases, wholesale inquiries, and local distribution.
      </p>
      
      <div className="relative mb-24">
        <img 
          src={images.banner}
          className="rounded-[3rem] shadow-2xl w-full h-[500px] object-cover" 
          alt="Himalayan Springs" 
        />
        <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-black/10"></div>
      </div>

      {/* --- Branch Section --- */}
      <div className="text-left mb-24">
        <span className="text-brand-accent font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Presence</span>
        <h2 className="text-5xl font-heading font-black text-brand-primary mb-12">Offline Branches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BranchCard 
            city="Katni"
            address="585, Mittal Gali, Near Daya Dham, Katni, Madhya Pradesh - 483501"
            phone="+91 62658 59281"
            email="kantamthegangawater01katni@gmail.com"
            mapsUrl="https://maps.google.com"
          />

          <BranchCard 
            city="Dabra"
            address="Ward no. 6, Gautam Vihar Colony, Chinnor Road, Dabra, Madhya Pradesh"
            phone="+91 62658 59281" 
            email="kantamthegangawater01dabra@gmail.com"
            mapsUrl="https://maps.google.com"
          />
        </div>
      </div>

      {/* --- Developer Advertisement Section --- */}
      <div className="relative group overflow-hidden bg-brand-primary rounded-[3rem] p-12 text-left mb-20 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Code2 size={200} className="text-white" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div>
            <span className="text-brand-accent font-black tracking-widest uppercase text-xs mb-4 block">Digital Architect</span>
            <h3 className="text-4xl font-heading font-black text-white mb-6 leading-tight">
              Looking to scale your <span className="italic font-light text-brand-accent">Digital Presence?</span>
            </h3>
            <p className="text-white/60 font-light text-lg mb-8 max-w-md">
              This high-performance platform was engineered for speed, SEO, and premium user experience. Let's build your next project together.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-[2rem] p-8 border border-white/10 space-y-6">
            <h4 className="text-white font-bold text-xl mb-4 border-b border-white/10 pb-4">Contact Developer</h4>
            
            <div className="flex items-center gap-4 group/item">
              <div className="p-3 bg-brand-accent rounded-xl text-brand-primary">
                <User size={20} />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Shyam Patidar</span>
            </div>

            <a href="tel:7354727368" className="flex items-center gap-4 group/item hover:translate-x-2 transition-transform">
              <div className="p-3 bg-white/10 rounded-xl text-brand-accent">
                <Phone size={20} />
              </div>
              <span className="text-white/90 font-medium">7354727368</span>
            </a>

            <a href="mailto:shyampatidar916@gmail.com" className="flex items-center gap-4 group/item hover:translate-x-2 transition-transform">
              <div className="p-3 bg-white/10 rounded-xl text-brand-accent">
                <Mail size={20} />
              </div>
              <span className="text-white/90 font-medium text-sm md:text-base">shyampatidar916@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Global Support Footer */}
      <div className="p-10 bg-white rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div>
          <h4 className="text-xl font-bold text-brand-primary">General Inquiries</h4>
          <p className="text-stone-500 font-light">Not near a branch? Reach our main support line.</p>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <Globe className="text-brand-accent" size={20} />
            <span className="font-medium text-brand-primary">www.kantamganga.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-brand-accent" size={20} />
            <span className="font-medium text-brand-primary">kantamthegangawater01@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BranchCard = ({ city, address, phone, email, mapsUrl }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-brand-accent/20 transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
      <div className="bg-brand-surface p-4 rounded-2xl group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
        <MapPin size={28} />
      </div>
      <span className="bg-stone-100 text-stone-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
        Active Branch
      </span>
    </div>
    
    <h3 className="text-3xl font-heading font-black text-brand-primary mb-4">{city}</h3>
    
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="mt-1"><MapPin size={16} className="text-brand-accent" /></div>
        <p className="text-stone-500 font-light leading-relaxed">{address}</p>
      </div>
      <div className="flex items-center gap-3">
        <Phone size={16} className="text-brand-accent" />
        <p className="text-brand-primary font-medium">{phone}</p>
      </div>
      <div className="flex items-center gap-3">
        <Mail size={16} className="text-brand-accent" />
        <p className="text-brand-primary font-medium text-sm break-all">{email}</p>
      </div>
    </div>

    <a 
      href={mapsUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full text-center mt-8 py-4 bg-brand-surface text-brand-primary font-black uppercase tracking-widest text-[10px] rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm"
    >
      Get Directions
    </a>
  </div>
);

// Added User icon for the ad section
const User = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default About;