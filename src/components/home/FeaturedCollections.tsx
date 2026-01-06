"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedCollections({ collections }: { collections: any[] }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[#FF0000] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Curated Sets</span>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase">Featured <br /> Collections</h2>
          </div>
          <Link href="/collections" className="text-black font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:text-[#FF0000] hover:border-[#FF0000] transition-all">
            View All Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-[400px] mb-8 overflow-hidden bg-zinc-100 flex items-center justify-center p-12">
                <div className="flex -space-x-20 group-hover:space-x-4 transition-all duration-700 ease-in-out">
                  {col.image_urls?.slice(0, 3).map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-48 h-64 shadow-2xl transition-transform duration-500"
                      style={{
                        zIndex: 10 - idx,
                        transform: `rotate(${(idx - 1) * 5}deg)`
                      }}
                    >
                      <Image src={img} alt={col.name} fill className="object-cover border-4 border-white" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-[#FF0000] text-white px-8 py-4 font-black uppercase tracking-widest">Shop Collection</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black uppercase tracking-tight">{col.name}</h3>
                <span className="text-[#FF0000] text-xl font-black">₹{col.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
