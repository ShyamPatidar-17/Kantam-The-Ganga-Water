import React, { useEffect, useState } from 'react';
import { Package, Clock, Truck, CheckCircle2, XCircle, Droplets, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { fetchMyOrders } from '../api';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });
    const [chartData, setChartData] = useState([]);
    const [timeframe, setTimeframe] = useState('week'); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const { data } = await fetchMyOrders();
                
                // 1. Update Stat Cards
                const summary = data.reduce((acc, order) => {
                    const status = order.status.toLowerCase();
                    if (acc.hasOwnProperty(status)) acc[status]++;
                    return acc;
                }, { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });

                setStats({ total: data.length, ...summary });

                // 2. Process Chart Data based on current timeframe
                const processed = generateTimelineData(data, timeframe);
                setChartData(processed);
                
                setLoading(false);
            } catch (err) {
                console.error("Dashboard Sync Error:", err);
            }
        };
        loadDashboardData();
    }, [timeframe]);

    // Proper Timeline Logic
    const generateTimelineData = (orders, period) => {
        const dataMap = {};
        const now = new Date();
        
        // Initialize placeholders based on period to ensure the graph shows a full range
        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                const label = d.toLocaleDateString('en-US', { weekday: 'short' });
                dataMap[label] = { name: label, received: 0, cancelled: 0, fullDate: d.toDateString() };
            }
        } else if (period === 'month') {
            for (let i = 29; i >= 0; i -= 2) { // Show every 2nd day for a month
                const d = new Date();
                d.setDate(now.getDate() - i);
                const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                dataMap[label] = { name: label, received: 0, cancelled: 0, fullDate: d.toDateString() };
            }
        } else if (period === 'year') {
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(now.getMonth() - i);
                const label = d.toLocaleDateString('en-US', { month: 'short' });
                dataMap[label] = { name: label, received: 0, cancelled: 0, fullDate: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) };
            }
        }

        // Fill data from orders
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            let label = "";

            if (period === 'week') label = date.toLocaleDateString('en-US', { weekday: 'short' });
            else if (period === 'month') label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            else label = date.toLocaleDateString('en-US', { month: 'short' });

            if (dataMap[label]) {
                dataMap[label].received += 1;
                if (order.status.toLowerCase() === 'cancelled') dataMap[label].cancelled += 1;
            }
        });

        return Object.values(dataMap);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <Droplets size={24} className="text-blue-600" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Flow <span className="text-slate-400 font-light italic">Analytics</span></h2>
                </div>
                
                {/* Timeframe Selector Pill */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    {['week', 'month', 'year'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                timeframe === t 
                                ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total" value={stats.total} icon={<Package size={16} />} color="bg-slate-100 text-white" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock size={16} />} color="bg-amber-50 text-amber-600" />
                <StatCard label="Processing" value={stats.processing} icon={<Droplets size={16} />} color="bg-indigo-50 text-indigo-600" />
                <StatCard label="Shipped" value={stats.shipped} icon={<Truck size={16} />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle2 size={16} />} color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Cancelled" value={stats.cancelled} icon={<XCircle size={16} />} color="bg-red-50 text-red-500" />
            </div>

            {/* Chart Section */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Order Volume: Last {timeframe}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Real-time Pipeline</span>
                </div>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorCan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}}
                            />
                            <Tooltip 
                                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '30px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
                            <Area 
                                name="Received"
                                type="monotone" 
                                dataKey="received" 
                                stroke="#2563eb" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorRec)" 
                            />
                            <Area 
                                name="Cancelled"
                                type="monotone" 
                                dataKey="cancelled" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1} 
                                fill="url(#colorCan)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, color, icon }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-4 ${color.split(' ')[0]} ${color.split(' ')[1].replace('text-', 'text-opacity-80')}`}>
            {icon}
        </div>
        <h3 className="text-3xl font-black tracking-tighter text-slate-900">{value}</h3>
        <p className={`mt-2 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md inline-block ${color}`}>
            {label}
        </p>
    </div>
);