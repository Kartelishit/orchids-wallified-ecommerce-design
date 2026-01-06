'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  X,
  Upload,
  Check
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const posterSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category_id: z.string().uuid('Please select a category'),
  is_best_seller: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  is_hidden: z.boolean().default(false),
  sizes: z.array(z.string()).default(['A4', 'A5', 'A6']),
  tags: z.string().transform(val => val.split(',').map(s => s.trim())),
});

type PosterFormValues = z.infer<typeof posterSchema>;

export default function AdminPosters() {
  const [posters, setPosters] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PosterFormValues>({
    resolver: zodResolver(posterSchema),
    defaultValues: {
      is_best_seller: false,
      is_trending: false,
      is_hidden: false,
      sizes: ['A4', 'A5', 'A6']
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [
        { data: postersData },
        { data: categoriesData }
      ] = await Promise.all([
        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*')
      ]);

      setPosters(postersData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    try {
      const payload = {
        ...data,
        image_url: imageUrl,
        tags: data.tags // already transformed by zod
      };

      if (editingPoster) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingPoster.id);
        if (error) throw error;
        toast.success('Poster updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([payload]);
        if (error) throw error;
        toast.success('Poster created successfully');
      }

      setIsModalOpen(false);
      setEditingPoster(null);
      reset();
      setImageUrl('');
      fetchData();
    } catch (error: any) {
      toast.error('Error saving poster: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Poster deleted');
      fetchData();
    } catch (error: any) {
      toast.error('Error deleting poster: ' + error.message);
    }
  };

  const filteredPosters = posters.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Posters</h1>
          <p className="text-gray-500 font-medium">Manage your poster inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingPoster(null);
            reset();
            setImageUrl('');
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg shadow-black/20"
        >
          <Plus size={18} />
          Add New Poster
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posters, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
          />
        </div>
        <button className="bg-white border border-gray-100 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white aspect-[3/4] rounded-3xl animate-pulse border border-gray-100" />
          ))
        ) : (
          filteredPosters.map((poster) => (
            <motion.div
              layout
              key={poster.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white group rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={poster.image_url}
                  alt={poster.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {poster.is_best_seller && (
                    <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Best Seller</span>
                  )}
                  {poster.is_trending && (
                    <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Trending</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setEditingPoster(poster);
                      setValue('name', poster.name);
                      setValue('description', poster.description);
                      setValue('price', poster.price);
                      setValue('category_id', poster.category_id);
                      setValue('is_best_seller', poster.is_best_seller);
                      setValue('is_trending', poster.is_trending);
                      setValue('is_hidden', poster.is_hidden);
                      setValue('sizes', poster.sizes || ['A4', 'A5', 'A6']);
                      setImageUrl(poster.image_url);
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(poster.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                  {poster.categories?.name}
                </p>
                <h3 className="font-bold text-lg leading-tight mb-2 truncate">{poster.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black">${poster.price}</span>
                  <div className="flex gap-1">
                    {poster.is_hidden ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-green-500" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal Form */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">
                {editingPoster ? 'Edit Poster' : 'Add New Poster'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Upload Area */}
                <div className="space-y-6">
                  <div className="aspect-[3/4] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
                            Change Image
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center gap-4 cursor-pointer p-8 text-center">
                        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
                          {uploading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload size={28} />}
                        </div>
                        <div>
                          <p className="font-bold uppercase tracking-widest text-xs">Upload Poster Image</p>
                          <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">JPG, PNG, WEBP (Max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Poster Name</label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium"
                      placeholder="e.g. Cyberpunk Samurai"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
                      <input
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                      <select
                        {...register('category_id')}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tags (comma separated)</label>
                    <input
                      {...register('tags')}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium"
                      placeholder="anime, futuristic, best-seller"
                    />
                  </div>

                  <div className="flex flex-wrap gap-6 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" {...register('is_best_seller')} className="sr-only" />
                        <div className="w-10 h-6 bg-gray-200 rounded-full transition-colors group-has-[:checked]:bg-yellow-400" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform group-has-[:checked]:translate-x-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Best Seller</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" {...register('is_trending')} className="sr-only" />
                        <div className="w-10 h-6 bg-gray-200 rounded-full transition-colors group-has-[:checked]:bg-red-500" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform group-has-[:checked]:translate-x-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Trending</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" {...register('is_hidden')} className="sr-only" />
                        <div className="w-10 h-6 bg-gray-200 rounded-full transition-colors group-has-[:checked]:bg-black" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform group-has-[:checked]:translate-x-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Hide Poster</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-900 transition-all shadow-xl shadow-black/20 mt-8"
                  >
                    {editingPoster ? 'Update Poster' : 'Publish Poster'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
