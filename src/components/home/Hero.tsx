"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FF0000]/5 -skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2">Premium 300GSM</span>
            <div className="flex items-center gap-1 text-[#FF0000]">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Limited Edition Prints</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-7xl md:text-[10rem] font-black text-black leading-[0.85] mb-10 tracking-tighter uppercase"
          >
            WALLS <br />
            THAT <br />
            <span className="text-[#FF0000] relative">
              ROAR
              <svg className="absolute -bottom-4 left-0 w-full h-4 text-[#FF0000]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="text-black inline-block ml-4">.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-zinc-400 text-lg md:text-xl max-w-md mb-12 font-medium leading-relaxed uppercase tracking-tight"
          >
            Stop living in a beige world. We create high-definition, non-tearable art for the rebels and the dreamers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link
              href="/shop/all-posters"
              className="group bg-black text-white px-12 py-6 font-black uppercase tracking-[0.2em] text-xs hover:bg-[#FF0000] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden"
            >
              <span className="relative z-10">Explore Shop</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            
            <Link
              href="/custom"
              className="border-2 border-black text-black px-12 py-6 font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all duration-500 flex items-center justify-center"
            >
              Build Your Own
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full max-w-[550px] mx-auto lg:ml-auto"
        >
          {/* Main Hero Image */}
          <div className="absolute inset-0 bg-zinc-100 -rotate-6 scale-95 z-0" />
          <div className="relative h-full w-full overflow-hidden shadow-[40px_40px_80px_rgba(0,0,0,0.15)] group">
            <Image
              src="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop"
              alt="Wallified Posters"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 border-[30px] border-white/10 pointer-events-none" />
          </div>
          
          {/* Floating Accent */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [-12, -8, -12]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -right-12 w-48 h-64 bg-white p-2 shadow-2xl z-20 hidden md:block border-4 border-white"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop"
                alt="Floating Poster"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm p-2 text-white">
              <p className="text-[8px] font-black uppercase tracking-widest text-center">Best Seller</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [12, 15, 12]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-white p-2 shadow-2xl z-20 hidden md:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=400&auto=format&fit=crop"
              alt="Floating Poster"
              fill
              className="object-cover p-1"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
