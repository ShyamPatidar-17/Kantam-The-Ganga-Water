import React, { useEffect, useState } from 'react';
import { fetchMyOrders } from '../api';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, delivered: 0 });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const { data } = await fetchMyOrders();
                setStats({
                    total: data.length,
                    pending: data.filter(o => o.status === 'Pending').length,
                    delivered: data.filter(o => o.status === 'Delivered').length
                });
            } catch (err) { console.error(err); }
        };
        loadStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <StatCard label="Total Orders" value={stats.total} color="bg-slate-100 text-slate-900" />
            <StatCard label="Pending Items" value={stats.pending} color="bg-blue-50 text-blue-600" />
            <StatCard label="Delivered" value={stats.delivered} color="bg-emerald-50 text-emerald-600" />
        </div>
    );
}

const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
        <h3 className="text-5xl font-black tracking-tighter">{value}</h3>
        <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block ${color}`}>
            {label}
        </p>
    </div>
);