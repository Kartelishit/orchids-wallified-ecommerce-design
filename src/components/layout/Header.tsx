"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingCart, ChevronDown, Menu, X, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const { cartCount } = useCart();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Fetch categories
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('name, slug');
      if (data) setCategories(data);
    };
    fetchCategories();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Dropdown = ({ items, type }: { items: any[], type: 'category' | 'collection' | 'help' }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 w-72 bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.1)] py-8 px-6 z-50 border-t-4 border-[#FF0000]"
    >
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <Link
            key={typeof item === 'string' ? item : item.slug}
            href={
              type === 'category' ? `/shop/${item.slug}` :
              type === 'collection' ? `/collections` :
              `/help`
            }
            className="group flex items-center justify-between text-black hover:text-[#FF0000] transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {typeof item === 'string' ? item : item.name}
            </span>
            <div className="w-0 group-hover:w-4 h-[2px] bg-[#FF0000] transition-all duration-300" />
          </Link>
        ))}
        {type === 'category' && (
          <Link
            href="/shop"
            className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-zinc-400 hover:text-black transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">View All Posters</span>
          </Link>
        )}
      </div>
    </motion.div>
  );

  const helpCenter = ["Shipping Policy", "Refund Policy", "FAQ"];

  return (
    <header
      className={`fixed top-12 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-2xl py-4" : "bg-transparent py-8"
      }`}
    >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" 
              alt="WALLIFIED" 
              className="h-10 w-auto object-contain transition-all duration-300 hover:scale-105"
              style={{ filter: 'brightness(0) drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))' }}
            />
          </Link>

          {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("shop")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
              Shop Posters <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {activeDropdown === "shop" && <Dropdown items={categories} type="category" />}
            </AnimatePresence>
          </div>

          <Link href="/collections" className="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
            Collections
          </Link>

          <Link href="/custom" className="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
            Custom Design
          </Link>

          {isAdmin && (
            <Link href="/admin/dashboard" className="flex items-center gap-1 text-red-600 font-bold uppercase text-xs tracking-widest hover:text-black transition-colors">
              <ShieldCheck size={14} /> Admin
            </Link>
          )}

          <div
            className="relative group"
            onMouseEnter={() => setActiveDropdown("help")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
              Help Center <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {activeDropdown === "help" && <Dropdown items={helpCenter} type="help" />}
            </AnimatePresence>
          </div>

          <Link href="/contact" className="text-black font-bold uppercase text-xs tracking-widest hover:text-[#FF0000] transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button className="text-black hover:text-[#FF0000] transition-colors">
            <Search size={20} />
          </button>
          <Link href="/profile" className="text-black hover:text-[#FF0000] transition-colors">
            <User size={20} />
          </Link>
          <Link href="/cart" className="relative text-black hover:text-[#FF0000] transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-[#FF0000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
          <button className="lg:hidden text-black" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-0 bg-white z-[200] p-8 flex flex-col"
            >
                <div className="flex justify-between items-center mb-12">
                  <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <img 
                      src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/9d2919b8-9e68-4c70-9a71-6175f2e26831/Gemini_Generated_Image_rmm9rsrmm9rsrmm9-removebg-preview-1767885732389.png?width=8000&height=8000&resize=contain" 
                      alt="WALLIFIED" 
                      className="h-10 w-auto object-contain"
                      style={{ filter: 'brightness(0) drop-shadow(0 0 8px rgba(255, 0, 0, 0.6))' }}
                    />
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              <Link href="/shop" className="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Shop</Link>
              <Link href="/collections" className="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Collections</Link>
              <Link href="/custom" className="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Custom</Link>
              <Link href="/help" className="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Help</Link>
              <Link href="/contact" className="text-3xl font-black uppercase tracking-tighter hover:text-[#FF0000]">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
