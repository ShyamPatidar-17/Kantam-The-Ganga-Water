import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
    PackageCheck, Loader2, MapPin, ChevronLeft, 
    CreditCard, ArrowRight, User as UserIcon, Phone
} from 'lucide-react';
// Import your new API functions
import { fetchUserProfile, placeOrder } from '../api/index'; 
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState({
        street: '', city: '', state: '', zip: '', phone: ''
    });

    // Fetch Identity using centralized API
    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const { data } = await fetchUserProfile();
                
                setUser(data);
                setFullName(data.fullName || '');
                if (data.address) {
                    setAddress({
                        street: data.address.street || '',
                        city: data.address.city || '',
                        state: data.address.state || '',
                        zip: data.address.zip || '',
                        phone: data.phone || ''
                    });
                }
            } catch (err) {
                // Interceptor handles 401, but we can handle UI feedback here
                toast.error('Identity sync failed');
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        getUserData();
    }, [navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return toast.error("Selection stream is empty");
        
        setLoading(true);
        try {
            const orderData = {
                userId: user._id,
                fullName: fullName,
                items: cart.map(item => ({
                    bottleId: item._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.price,
                    size: item.size
                })),
                totalAmount: getCartTotal(),
                shippingAddress: address,
                paymentMethod: 'COD'
            };

            // Use the placeOrder function from your API file
            const { data } = await placeOrder(orderData);

            if (data.success) {
                toast.success("Logistics confirmed!");
                setOrderComplete(true);
                clearCart();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Order pipeline failed.");
        } finally {
            setLoading(false);
        }
    };
    if (orderComplete) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center animate-in fade-in duration-700">
                <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-100 animate-bounce">
                    <PackageCheck size={50} strokeWidth={1.5} />
                </div>
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-4 text-slate-900 leading-none">Order <br/><span className="text-blue-600">Logged</span></h2>
                <p className="text-slate-400 max-w-sm mx-auto mb-10 text-sm font-medium tracking-tight">
                    Your request has been successfully processed. Radhe Radhe! You can track your vessel in the orders section.
                </p>
                <button onClick={() => navigate('/orders')} className="group bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
                    View Orders <ArrowRight size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-body pb-20">
            <div className="max-w-[1200px] mx-auto pt-32 px-8 md:px-16">
                
                <div className="flex items-center gap-4 mb-16">
                    <button onClick={() => navigate('/cart')} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Checkout <span className="text-blue-600 italic font-light">Identity</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* --- LEFT: SHIPPING & IDENTITY FORM --- */}
                    <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-12">
                        
                        {/* Phase 01: Recipient Identity */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-3">
                                    <UserIcon size={14}/> 01. Recipient Identity
                                </h3>
                            </div>
                            <div className="group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Full Name</label>
                                <input 
                                    value={fullName}
                                    placeholder="Who is receiving this vessel?" 
                                    className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" 
                                    onChange={e => setFullName(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Phase 02: Shipping Destination */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-3">
                                    <MapPin size={14}/> 02. Shipping Destination
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                <input 
                                    value={address.street}
                                    placeholder="Street Address / House No." 
                                    className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" 
                                    onChange={e => setAddress({...address, street: e.target.value})} 
                                    required 
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input value={address.city} placeholder="City" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" onChange={e => setAddress({...address, city: e.target.value})} required />
                                    <input value={address.state} placeholder="State" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" onChange={e => setAddress({...address, state: e.target.value})} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input value={address.zip} placeholder="Zip Code" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" onChange={e => setAddress({...address, zip: e.target.value})} required />
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-5 text-slate-300" />
                                        <input value={address.phone} placeholder="Mobile Number" className="w-full pl-12 p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-sm" onChange={e => setAddress({...address, phone: e.target.value})} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 03: Payment Protocol */}
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-3 border-b border-slate-100 pb-4">
                                <CreditCard size={14}/> 03. Payment Protocol
                            </h3>
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black italic">COD</div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight text-slate-900">Cash on Delivery</p>
                                        <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Pay upon physical arrival</p>
                                    </div>
                                </div>
                                <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                            </div>
                        </div>

                        <button 
                            disabled={loading} 
                            className="w-full bg-slate-900 text-white py-7 rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Finalize Order Stream"}
                        </button>
                    </form>

                    {/* --- RIGHT: ORDER SUMMARY --- */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-50 rounded-[3.5rem] p-12 h-fit sticky top-32 border border-slate-100">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">Stream Review</h3>
                            
                            <div className="space-y-6 mb-12 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black uppercase tracking-tighter text-slate-900">{item.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                Qty: {item.quantity} | {item.size}
                                            </span>
                                        </div>
                                        <span className="font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-slate-200">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Logistics Fee</span>
                                    <span className="text-emerald-500 italic">Complementary</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-900">Total Payable</span>
                                    <span className="text-6xl font-black text-blue-600 tracking-tighter leading-none">₹{getCartTotal().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;