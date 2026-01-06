"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function PosterKits() {
  return (
    <section className="py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-[#FF0000] font-black uppercase tracking-[0.3em] text-xs mb-6 block">Room Makeover</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">
            50–60 PIECE <br />
            POSTER KITS
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            The ultimate wall transformation. Our mega kits cover entire walls with cohesive, high-energy designs.
          </p>
          <div className="flex items-center gap-6 mb-12">
            <span className="text-3xl font-black text-[#FF0000]">₹2,499</span>
            <span className="text-gray-500 line-through">₹4,999</span>
            <span className="bg-[#FF0000] text-white text-[10px] font-black uppercase px-2 py-1">50% OFF</span>
          </div>
          <Link
            href="/shop/poster-kits"
            className="inline-block bg-[#FF0000] text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Explore Kits
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[600px] group"
        >
          <Image
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000"
            alt="Poster Kit Wall"
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
