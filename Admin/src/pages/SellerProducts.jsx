import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductsBySeller, deleteProduct } from '../api'; // Ensure deleteProduct is imported
import { Package, Trash2, Edit3, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SellerProducts() {
    const { id } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSellerData = async () => {
            try {
                setLoading(true);
                const { data } = await fetchProductsBySeller(id);
                setProducts(data);
            } catch (err) {
                toast.error("Could not load seller products");
            } finally {
                setLoading(false);
            }
        };
        loadSellerData();
    }, [id]);

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? This will also remove the image from the cloud.")) return;
        
        try {
            await deleteProduct(productId);
            // Update UI by filtering out the deleted product
            setProducts(products.filter(p => p._id !== productId));
            toast.success("Product and assets removed successfully");
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <span className="font-black uppercase tracking-widest text-xs">Loading Inventory...</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Seller Inventory</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Managing {products.length} listed items</p>
                </div>
                <Link to="/addItem" className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-200">
                    <Plus size={20} />
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                    <Package className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No products listed by this seller yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-[2rem] border border-slate-50 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                            {/* Product Image */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                <img 
                                    /* FIX: Use the URL directly from the DB. 
                                       Cloudinary URLs are absolute (https://...)
                                    */
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                                    {product.size}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-slate-900 truncate pr-4 uppercase tracking-tighter">{product.name}</h3>
                                    <span className="text-blue-600 font-black">₹{product.price}</span>
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-6 h-8">{product.description || 'No description provided.'}</p>
                                
                                <div className="flex gap-2">
                                    <Link 
                                        to={`/editItem/${product._id}`}
                                        className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit3 size={14} /> Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product._id)}
                                        className="w-12 bg-slate-50 text-slate-400 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}