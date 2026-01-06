'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  ImageIcon, 
  Layers, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosters: 0,
    totalCollections: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const [
        { count: postersCount },
        { count: collectionsCount },
        { data: ordersData },
        { count: pendingCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Pending')
      ]);

      const totalRevenue = ordersData?.reduce((acc, order) => acc + (Number(order.total) || 0), 0) || 0;

      setStats({
        totalPosters: postersCount || 0,
        totalCollections: collectionsCount || 0,
        totalOrders: ordersData?.length || 0,
        revenue: totalRevenue,
        pendingOrders: pendingCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    { name: 'Total Posters', value: stats.totalPosters, icon: ImageIcon, color: 'bg-blue-500' },
    { name: 'Collections', value: stats.totalCollections, icon: Layers, color: 'bg-purple-500' },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-green-500' },
    { name: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-red-500' },
  ];

  const dummyChartData = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 600 },
    { name: 'Thu', revenue: 800 },
    { name: 'Fri', revenue: 500 },
    { name: 'Sat', revenue: 900 },
    { name: 'Sun', revenue: 1100 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            <TrendingUp size={14} />
            +12.5% this week
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <button className="text-gray-300 hover:text-black transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.name}</p>
              <h2 className="text-3xl font-black tabular-nums">{card.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <TrendingUp className="text-red-500" size={18} />
              Revenue Overview
            </h3>
            <select className="bg-gray-50 border-none text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pending Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <div className="p-3 bg-red-500 w-fit rounded-2xl shadow-lg shadow-red-500/50">
              <Clock size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-black">{stats.pendingOrders}</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Pending Orders</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              You have {stats.pendingOrders} orders that need your attention. Ship them out to keep your customers happy!
            </p>
            <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">
              Process Orders
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  );
}
