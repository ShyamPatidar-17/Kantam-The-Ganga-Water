import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Droplets, Loader2, ChevronLeft, CheckCircle, ArrowRight, MapPin, User, Mail, Phone,Globe,ExternalLink} from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchProductById } from '../api/index'; 
import { useCart } from '../context/CartContext'; 

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(0);

    useEffect(() => {
        const getProductData = async () => {
            try {
                setLoading(true);
                const { data } = await fetchProductById(id);
                setProduct(data);
            } catch (err) {
                toast.error("Source synchronization failed");
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [id]);

    const handleInquiry = () => {
        const subject = encodeURIComponent(`Bulk Inquiry: ${product?.name}`);
        const body = encodeURIComponent(`Hello, I am interested in bulk logistics for the ${product?.name}. Please provide a commercial quote.`);
        window.location.href = `mailto:kantamthegangawater01dabra@gmail.com?subject=${subject}&body=${body}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    if (!product) return <div className="p-20 text-center uppercase tracking-[0.4em] font-black text-slate-300">Vessel Not Found</div>;

    const seller = product.sellerId;

    return (
        <div className="min-h-screen bg-white font-body selection:bg-blue-100">
            <div className="max-w-[1200px] mx-auto pt-32 pb-24 px-6 md:px-12">
                
                {/* --- BACK NAVIGATION --- */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-12 uppercase text-[10px] font-black tracking-[0.3em]"
                >
                    <ChevronLeft size={14} strokeWidth={3} /> Return to Source
                </button>

                {/* --- PRODUCT HERO SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32">
                    
                    {/* Gallery Left */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="bg-slate-50 rounded-[3.5rem] aspect-square flex items-center justify-center p-12 border border-slate-100 relative overflow-hidden group">
                            <img 
                                src={product.images?.[selectedImg]} 
                                alt={product.name} 
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute top-8 left-8 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                                <Droplets size={12} className="text-blue-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Purity Verified</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                            {product.images?.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setSelectedImg(i)} 
                                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-2 ${selectedImg === i ? 'border-blue-600 bg-white shadow-xl' : 'border-transparent bg-slate-50 opacity-60'}`}
                                >
                                    <img src={img} className="h-full w-full object-contain mix-blend-multiply" alt="thumb" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Right */}
                    <div className="lg:col-span-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-blue-600 mb-6 font-black uppercase text-[10px] tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full">
                            <CheckCircle size={14} /> Registered Vessel
                        </div>
                        
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] mb-6">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retail Value</span>
                                <span className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">₹{product.price}</span>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-200" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vessel Volume</span>
                                <span className="text-xl font-black text-slate-900 uppercase">{product.size}</span>
                            </div>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed font-medium mb-12 max-w-lg italic">
                            "{product.description}"
                        </p>

                        <button 
                            onClick={() => addToCart(product)} 
                            className="group w-full max-w-md bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95"
                        >
                            Commit to Selection <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* --- FOOTER UTILITY BLOCKS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16 border-t border-slate-100">
                    
                    {/* 1. SELLER IDENTITY (Elite Bespoke Block) */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl lg:col-span-1">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-600/30 rounded-full blur-3xl" />
                        
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-400 block mb-6">Bespoke Inquiries</span>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                                <User size={24} className="text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-1">
                                    {seller?.fullName || "Bespoke Vendor"}
                                </h4>
                                <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest">Authorized Source</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-10">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Mail size={14} className="text-blue-500" />
                                <span className="text-[11px] font-bold lowercase truncate">{seller?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Phone size={14} className="text-blue-500" />
                                <span className="text-[11px] font-bold">{seller?.phone || 'Contact Pending'}</span>
                            </div>
                        </div>

                        <button onClick={handleInquiry} className="w-full py-4 bg-blue-600 hover:bg-white hover:text-slate-900 transition-all rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 group">
                            Bulk Inquiry <Globe size={12} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>

                    {/* 2. MAIN BRANCH DETAILS */}
                    <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between">
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400 block mb-6">Main Branch</span>
                            <div className="flex items-start gap-4 mb-6">
                                <MapPin size={24} className="text-slate-900 mt-1 shrink-0" />
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">Dabra Division</h4>
                                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider leading-relaxed">
                                        Ward no. 6, Gautam Vihar Colony,<br/>
                                        Chinnor Road, Dabra,<br/>
                                        Madhya Pradesh — 475110
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-200">
                            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-between group">
                                <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Navigate to Branch</span>
                                <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* 3. COMMUNICATION PIPELINE */}
                    <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between">
                        <div className="space-y-6">
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-600 block">Communication</span>
                            <div className="space-y-4">
                                <a href="mailto:kantamthegangawater01dabra@gmail.com" className="group block">
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Official Mail</span>
                                    <span className="text-[11px] md:text-xs font-black text-slate-900 group-hover:text-blue-600 transition-all break-all">kantamthegangawater01dabra@gmail.com</span>
                                </a>
                                <a href="tel:+916265859281" className="group block">
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Direct Line</span>
                                    <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-all tracking-tighter">+91 62658 59281</span>
                                </a>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                            <span className="flex items-center gap-1.5 text-[7px] font-black text-emerald-500 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Main Branch Active
                            </span>
                        </div>
                    </div>

                </div>

                <p className="mt-16 text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.8em]">
                    Kantam Heritage Logistics • Dabra Branch • Established 2026
                </p>
            </div>
        </div>
    );
};

export default ProductDetails;