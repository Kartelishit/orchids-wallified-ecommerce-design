'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Layers,
  X,
  Upload,
  Check,
  LayoutGrid,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const collectionSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  is_featured: z.boolean().default(false),
  product_ids: z.array(z.string()).min(3, 'A collection must have at least 3 posters'),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

export default function AdminCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [allPosters, setAllPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosters, setSelectedPosters] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      is_featured: false,
      product_ids: []
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [
        { data: collectionsData },
        { data: postersData }
      ] = await Promise.all([
        supabase.from('collections').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*')
      ]);

      setCollections(collectionsData || []);
      setAllPosters(postersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // Get images from selected posters for the collection preview
      const images = allPosters
        .filter(p => selectedPosters.includes(p.id))
        .map(p => p.image_url);

      const payload = {
        ...data,
        product_ids: selectedPosters,
        image_urls: images
      };

      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(payload)
          .eq('id', editingCollection.id);
        if (error) throw error;
        toast.success('Collection updated');
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([payload]);
        if (error) throw error;
        toast.success('Collection created');
      }

      setIsModalOpen(false);
      setEditingCollection(null);
      reset();
      setSelectedPosters([]);
      fetchData();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const togglePoster = (id: string) => {
    if (selectedPosters.includes(id)) {
      setSelectedPosters(selectedPosters.filter(pId => pId !== id));
    } else {
      setSelectedPosters([...selectedPosters, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Collections</h1>
          <p className="text-gray-500 font-medium">Manage your 3-poster sets</p>
        </div>
        <button
          onClick={() => {
            setEditingCollection(null);
            reset();
            setSelectedPosters([]);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg"
        >
          <Plus size={18} />
          Create Collection
        </button>
      </div>

      {/* Collections Table-like Grid */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold uppercase tracking-widest text-xs">Active Collections</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs font-medium outline-none border border-transparent focus:border-black transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Collection Name</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex -space-x-4">
                      {col.image_urls?.slice(0, 3).map((img: string, i: number) => (
                        <div key={i} className="w-12 h-16 rounded-lg border-2 border-white overflow-hidden shadow-sm">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-lg">{col.name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[200px]">{col.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {col.product_ids?.length || 0} Posters
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg">${col.price}</td>
                  <td className="px-8 py-6">
                    {col.is_featured ? (
                      <span className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Check size={14} /> Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Standard</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingCollection(col);
                          setValue('name', col.name);
                          setValue('description', col.description);
                          setValue('price', col.price);
                          setValue('is_featured', col.is_featured);
                          setSelectedPosters(col.product_ids || []);
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-black hover:text-white rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {editingCollection ? 'Edit Collection' : 'Create New Collection'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <form id="col-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Collection Title</label>
                    <input {...register('name')} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Set Price ($)</label>
                    <input type="number" {...register('price', { valueAsNumber: true })} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea {...register('description')} rows={4} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium resize-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" {...register('is_featured')} className="w-5 h-5 accent-red-500" />
                    <label className="text-[10px] font-black uppercase tracking-widest">Mark as Featured Set</label>
                  </div>

                  <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4">Live Preview (3 Selected)</p>
                    <div className="flex justify-center -space-x-8">
                      {selectedPosters.slice(0, 3).map((pId) => {
                        const p = allPosters.find(x => x.id === pId);
                        return (
                          <div key={pId} className="w-32 aspect-[3/4] rounded-xl border-4 border-white shadow-2xl overflow-hidden transform hover:-translate-y-4 transition-transform">
                            <img src={p?.image_url} className="w-full h-full object-cover" alt="" />
                          </div>
                        );
                      })}
                      {selectedPosters.length < 3 && Array(3 - selectedPosters.length).fill(0).map((_, i) => (
                        <div key={i} className="w-32 aspect-[3/4] rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center border-dashed">
                          <Plus className="text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Posters ({selectedPosters.length})</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="text" placeholder="Filter posters..." className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black outline-none border border-transparent focus:border-black" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {allPosters.map((poster) => (
                      <button
                        key={poster.id}
                        type="button"
                        onClick={() => togglePoster(poster.id)}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                          selectedPosters.includes(poster.id) ? 'border-red-500 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={poster.image_url} className="w-full h-full object-cover" alt="" />
                        {selectedPosters.includes(poster.id) && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  form="col-form"
                  type="submit"
                  className="flex-grow bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all shadow-xl shadow-black/20"
                >
                  Save Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
