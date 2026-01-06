'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Truck, 
  CheckCircle, 
  Clock,
  X,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      toast.error('Error updating status: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'printed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Orders</h1>
          <p className="text-gray-500 font-medium">Manage customer purchases and custom prints</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-8 py-6 h-20 bg-gray-50/50" />
                  </tr>
                ))
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-mono text-[10px] font-bold text-gray-400">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-sm">{order.customer_name}</p>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest">{order.customer_email}</p>
                    </td>
                    <td className="px-8 py-6 text-xs font-medium">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {order.items?.length || 0} Items
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black">${order.total}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-black text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Order Details</h2>
                  <p className="text-gray-400 text-xs font-mono">#{selectedOrder.id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Items List */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <div key={i} className="flex gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                          <div className="w-20 aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow flex flex-col justify-center">
                            <h4 className="font-bold text-lg leading-tight">{item.name}</h4>
                            <div className="flex gap-4 mt-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Size: {item.size}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Qty: {item.quantity}</span>
                            </div>
                            {item.is_custom && (
                              <div className="mt-4 flex gap-2">
                                <span className="bg-red-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded">Custom Design</span>
                                <button className="text-black text-[8px] font-black uppercase tracking-widest underline flex items-center gap-1">
                                  <Download size={10} /> Download Artwork
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end justify-center">
                            <p className="font-black text-lg">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Subtotal</span>
                          <span className="font-bold">${selectedOrder.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Shipping</span>
                          <span className="font-bold text-green-600">FREE</span>
                        </div>
                        <div className="h-px bg-gray-200 my-2" />
                        <div className="flex justify-between text-lg">
                          <span className="font-black uppercase tracking-tighter">Total</span>
                          <span className="font-black text-red-500">${selectedOrder.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black text-white rounded-2xl shadow-xl space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Status</h4>
                      <div className="flex flex-col gap-2">
                        {['Pending', 'Printed', 'Shipped', 'Delivered'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              selectedOrder.status === status 
                                ? 'bg-white text-black' 
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Customer Info */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Customer Info</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl"><Mail size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                          <p className="text-sm font-bold">{selectedOrder.customer_email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl"><Phone size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</p>
                          <p className="text-sm font-bold">{selectedOrder.customer_phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl"><MapPin size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping Address</p>
                          <p className="text-sm font-bold leading-relaxed">
                            {selectedOrder.shipping_address}<br />
                            {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl"><Calendar size={16} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Date</p>
                          <p className="text-sm font-bold">{format(new Date(selectedOrder.created_at), 'MMMM dd, yyyy HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Print Queue Note</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Custom posters should be verified for resolution before printing. Use the "Download Artwork" link to get the high-res file.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
