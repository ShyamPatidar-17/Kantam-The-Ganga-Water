import React, { useState ,useEffect} from 'react';
import { useCart } from '../context/CartContext';
import { PackageCheck, Truck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../App';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', phone: ''
  });


  const userInfo = localStorage.getItem("token");
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        if (!userInfo) {
          navigate('/login');
          return;
        }
  
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo}`,
            },
          };
  
          const { data } = await axios.get(`${API_URL}/users/profile`, config);
          setUser(data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load profile');
          if (err.response?.status === 401) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserProfile();
    }, [ userInfo]);

    console.log(user)
  

const handlePlaceOrder = async (e) => {
  e.preventDefault();
  if (cart.length === 0) return toast.error("Your cart is empty");

  setLoading(true);

  try {
    // 1. Get the raw string
    const token = localStorage.getItem('token'); 

    // 2. Parse the string into an object
    const userData = user

    console.log("UserData:",userData)

    if (!userData || !token) {
      toast.error("Please login to place an order");
      setLoading(false);
      return;
    }

    // 3. MAP THE DATA (Now using userData.id or userData._id)
    const orderData = {
      userId: userData.id || userData._id, 
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

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success("Order received at source!");
      setOrderComplete(true);
      clearCart();
    }
  } catch (err) {
    console.error("Checkout Error:", err);
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else {
      // Show the specific validation error from the backend if available
      toast.error(err.response?.data?.message || "Order validation failed.");
    }
  } finally {
    setLoading(false);
  }
};

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 text-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <PackageCheck size={40} />
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Confirmed</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-10">
          Your order has been logged. Our logistics team will contact you for <span className="text-slate-900 font-bold">Cash on Delivery</span>.
        </p>
        <button onClick={() => window.location.href = '/'} className="bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px]">
          Back to Source
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Shipping Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-10">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Shipping <span className="text-brand-accent italic font-light">Details</span></h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Truck size={14} /> Currently delivering via COD only
            </p>
          </div>

          <div className="space-y-4">
            <input placeholder="Full Address / Street" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent" onChange={e => setAddress({...address, street: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="City" className="p-5 bg-slate-50 rounded-2xl outline-none" onChange={e => setAddress({...address, city: e.target.value})} required />
              <input placeholder="State" className="p-5 bg-slate-50 rounded-2xl outline-none" onChange={e => setAddress({...address, state: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Zip Code" className="p-5 bg-slate-50 rounded-2xl outline-none" onChange={e => setAddress({...address, zip: e.target.value})} required />
              <input placeholder="Phone Number" className="p-5 bg-slate-50 rounded-2xl outline-none" onChange={e => setAddress({...address, phone: e.target.value})} required />
            </div>
          </div>

          <div className="p-8 bg-brand-primary rounded-[2.5rem] text-white">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-4">Payment Method</h4>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-brand-accent flex items-center justify-center">
                <div className="w-2 h-2 bg-brand-accent rounded-full" />
              </div>
              <span className="font-bold text-lg">Cash on Delivery (COD)</span>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-accent hover:text-brand-primary transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Order"}
          </button>
        </form>

        {/* Order Review Sidebar */}
        <div className="bg-slate-50 rounded-[3.5rem] p-12 h-fit sticky top-32">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-10">Review Items</h3>
          <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-2">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                <div className="flex flex-col">
                    <span>{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium lowercase">qty: {item.quantity} | {item.size}</span>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-8 flex justify-between items-baseline">
            <span className="font-black text-xs uppercase tracking-widest">Grand Total</span>
            <span className="text-5xl font-black">₹{getCartTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;