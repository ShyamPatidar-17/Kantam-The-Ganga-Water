import React, { useState } from 'react';
import { addProduct } from '../api';
import { Upload, X, Loader2 } from 'lucide-react'; // Optional: for better UI
import toast from 'react-hot-toast';

export default function AddItem() {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', size: '500ml', price: '', stock: '', description: '' });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Enforce maximum 4 images
        if (files.length + images.length > 4) {
            toast.error("Maximum 4 images allowed");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Generate Previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Minimum 1 image
        if (images.length === 0) {
            return toast.error("Please upload at least 1 image");
        }

        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const data = new FormData();
        
        data.append('sellerId', userData._id);
        Object.keys(form).forEach(key => data.append(key, form[key]));
        
        // Append images to 'images' key (matches backend upload.array('images'))
        images.forEach(img => data.append('images', img));

        try {
            await addProduct(data);
            toast.success("Product added to Kantam Inventory");
            // Reset form if desired
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-3xl border border-slate-50 mx-auto mt-20">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase italic">Inventory <span className="text-blue-600">Registration</span></h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <input placeholder="Bottle Name" className="col-span-2 p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setForm({...form, name: e.target.value})} required />
                
                <select className="p-4 bg-slate-50 rounded-2xl outline-none" value={form.size} onChange={e => setForm({...form, size: e.target.value})}>
                    {['250ml', '500ml', '1ltr', '2ltr', '10ltr'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <input type="number" placeholder="Price (INR)" className="p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setForm({...form, price: e.target.value})} required />
                <input type="number" placeholder="Initial Stock" className="p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setForm({...form, stock: e.target.value})} required />

                {/* Custom Image Upload Section */}
                <div className="col-span-2 space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Upload Images (Min 1, Max 4)
                    </label>
                    
                    <div className="grid grid-cols-4 gap-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                <img src={url} className="w-full h-full object-contain p-2" alt="preview" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        
                        {images.length < 4 && (
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                <Upload size={20} className="text-slate-400" />
                                <span className="text-[8px] font-black mt-2 text-slate-400 uppercase">Add Image</span>
                                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>

                <textarea placeholder="Product Description" className="col-span-2 p-4 bg-slate-50 rounded-2xl h-32 outline-none" onChange={e => setForm({...form, description: e.target.value})} maxLength="500"></textarea>
                
                <button 
                    disabled={loading}
                    className="col-span-2 bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-blue-600 transition-all uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Register Product"}
                </button>
            </form>
        </div>
    );
}