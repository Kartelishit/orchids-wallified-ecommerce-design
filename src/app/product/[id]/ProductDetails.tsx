"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Truck, RotateCcw, Star, Plus, Minus, ShoppingBag } from "lucide-react";

export default function ProductDetails({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("A4");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const sizes = [
    { name: "A6", dimensions: "105 x 148 mm" },
    { name: "A5", dimensions: "148 x 210 mm" },
    { name: "A4", dimensions: "210 x 297 mm" },
    { name: "A3", dimensions: "297 x 420 mm" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Product Image Section */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-32"
        >
          <div className="relative aspect-[3/4] bg-zinc-100 group">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover shadow-2xl"
              priority
            />
            {/* Aesthetic overlay */}
            <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
          </div>
          
          <div className="mt-8 grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-zinc-100 relative cursor-pointer overflow-hidden group">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col pt-4">
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#FF0000] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block"
          >
            {product.categories?.name || "Premium Art Board"}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase mb-8 leading-[0.85]"
          >
            {product.name}
          </motion.h1>
          
          <div className="flex items-center gap-8 mb-10">
            <span className="text-4xl font-black text-[#FF0000]">₹{product.price}</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-[#FF0000] text-[#FF0000]" />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">120+ Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest">Select Size</h4>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Size Guide</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sizes.map((size) => (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                className={`flex flex-col items-center py-4 border-2 transition-all duration-300 ${
                  selectedSize === size.name 
                    ? "border-[#FF0000] bg-[#FF0000] text-white" 
                    : "border-zinc-100 text-black hover:border-black"
                }`}
              >
                <span className="text-sm font-black uppercase mb-1">{size.name}</span>
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${selectedSize === size.name ? "text-white/60" : "text-zinc-400"}`}>
                  {size.dimensions}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <div className="flex items-center border-2 border-zinc-100 h-16 px-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:text-[#FF0000] transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-black text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:text-[#FF0000] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={() => addToCart({ ...product, quantity, size: selectedSize })}
            className="flex-1 bg-black text-white h-16 flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-[#FF0000] transition-all group relative overflow-hidden"
          >
            <ShoppingBag size={18} />
            <span className="relative z-10">Add to Bag</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-16 border-t border-zinc-100">
          <div className="flex gap-8 border-b border-zinc-100 mb-8">
            {["description", "shipping", "quality"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-6 text-[10px] font-black uppercase tracking-[0.3em] relative transition-colors ${
                  activeTab === tab ? "text-black" : "text-zinc-300 hover:text-zinc-500"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF0000]"
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="min-h-[100px]">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.p
                  key="desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-zinc-500 leading-relaxed text-sm"
                >
                  {product.description || "Premium quality wall poster printed on high-grade 300GSM art board with a matte finish. Designed to bring life to your workspace, bedroom, or living room."}
                </motion.p>
              )}
              {activeTab === "shipping" && (
                <motion.div
                  key="ship"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-zinc-500 text-sm space-y-4"
                >
                  <p>• Dispatched within 24-48 hours</p>
                  <p>• Free shipping on all prepaid orders</p>
                  <p>• Delivered in 3-7 business days across India</p>
                </motion.div>
              )}
              {activeTab === "quality" && (
                <motion.div
                  key="qual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-zinc-500 text-sm space-y-4"
                >
                  <p>• 300 GSM Premium Art Board</p>
                  <p>• Non-tearable, water-resistant material</p>
                  <p>• Fade-proof high-definition printing</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-zinc-100">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Truck size={24} className="text-[#FF0000]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center sm:text-left">Free Express Shipping</span>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-3">
            <ShieldCheck size={24} className="text-[#FF0000]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center sm:text-left">Damage-Proof Packing</span>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-3">
            <RotateCcw size={24} className="text-[#FF0000]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-center sm:text-left">7-Day Easy Replacement</span>
          </div>
        </div>
      </div>
    </div>
  );
}
