import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, UploadCloud, X, Loader2, Package, Database } from 'lucide-react';

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // imageFiles stores the actual File objects for new uploads
    const [imageFiles, setImageFiles] = useState([null, null, null, null]); 
    // previews stores the URLs (either Cloudinary HTTPS or local blob: URLs)
    const [previews, setPreviews] = useState(["", "", "", ""]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        size: '',
        stock: '',
        description: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/products/particular/${id}`);
                setFormData({
                    name: data.name || '',
                    price: data.price || '',
                    size: data.size || '1ltr',
                    stock: data.stock || '',
                    description: data.description || ''
                });

                if (data.images) {
                    const currentImages = ["", "", "", ""];
                    data.images.forEach((img, i) => { if(i < 4) currentImages[i] = img; });
                    setPreviews(currentImages);
                }
            } catch (err) {
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleImageChange = (index, file) => {
        if (!file) return;

        // 1. Update File state for the specific slot
        const updatedFiles = [...imageFiles];
        updatedFiles[index] = file;
        setImageFiles(updatedFiles);

        // 2. Update Preview state (Blob URL for local preview)
        const updatedPreviews = [...previews];
        const objectUrl = URL.createObjectURL(file);
        updatedPreviews[index] = objectUrl;
        setPreviews(updatedPreviews);

        // Cleanup: Ideally revoke old blob URLs here to save memory
    };

    const clearSlot = (index) => {
        const updatedFiles = [...imageFiles];
        updatedFiles[index] = null;
        setImageFiles(updatedFiles);

        const updatedPreviews = [...previews];
        updatedPreviews[index] = "";
        setPreviews(updatedPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        
        // Filter out Cloudinary URLs we want to keep
        const keptImages = previews.filter(url => url && url.startsWith('http'));
        data.append('existingImages', JSON.stringify(keptImages));

        // Append new files to the same 'images' key the backend expects
        imageFiles.forEach((file) => {
            if (file) data.append('images', file);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/products/${id}`, data, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            toast.success("Product and assets updated successfully");
            navigate(-1);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-slate-300">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-black uppercase tracking-[0.3em] text-xs">Synchronizing Source...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 pt-32 pb-20 font-body">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 mb-8 hover:text-brand-primary transition-all group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-[10px] font-black uppercase tracking-widest">Back to Inventory</span>
            </button>

            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl space-y-10">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-brand-primary">
                        Edit <span className="text-brand-accent italic font-light">Inventory</span>
                    </h2>
                    <p className="text-slate-300 text-[10px] font-bold mt-2 uppercase tracking-widest">Update specs and cloud assets for vessel {id}</p>
                </div>

                {/* --- Multi-Image Asset Manager --- */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Cloud Asset Slots (Max 4)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((index) => (
                            <div key={index} className="relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden group">
                                {previews[index] ? (
                                    <>
                                        <img 
                                            src={previews[index]} 
                                            alt="Preview" 
                                            className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <label className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-brand-accent transition-colors">
                                                Change
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files[0])} />
                                            </label>
                                            <button type="button" onClick={() => clearSlot(index)} className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-100 transition-colors">
                                        <UploadCloud className="text-slate-300 mb-2" size={24} />
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Empty Slot</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(index, e.target.files[0])} />
                                    </label>
                                )}
                                <div className="absolute top-3 left-3 w-5 h-5 bg-white rounded-lg flex items-center justify-center text-[9px] font-black text-slate-300 shadow-sm border border-slate-50">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Product Specs --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 col-span-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Vessel Name</label>
                        <input 
                            className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-brand-accent transition-all font-bold text-slate-700"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Retail Price (₹)</label>
                        <input 
                            type="number"
                            className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none font-bold text-slate-700"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Stock Level</label>
                        <input 
                            type="number"
                            className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none font-bold text-slate-700"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Source Description</label>
                        <textarea 
                            className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none h-32 font-medium text-slate-600 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    disabled={submitting}
                    type="submit" 
                    className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-accent hover:text-brand-primary transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {submitting ? "UPLOADING TO SOURCE..." : "SYNC CHANGES"}
                </button>
            </form>
        </div>
    );
};

export default EditItem;