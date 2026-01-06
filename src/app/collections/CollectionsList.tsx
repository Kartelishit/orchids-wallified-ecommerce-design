"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CollectionsList({ collections }: { collections: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {collections.map((col, i) => (
        <motion.div
          key={col.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="group cursor-pointer"
        >
          <div className="relative h-[450px] mb-8 overflow-hidden bg-zinc-100 flex items-center justify-center p-12">
            <div className="flex -space-x-24 group-hover:space-x-4 transition-all duration-700 ease-in-out">
              {col.image_urls?.slice(0, 3).map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative w-56 h-72 shadow-2xl transition-transform duration-500"
                  style={{
                    zIndex: 10 - idx,
                    transform: `rotate(${(idx - 1) * 8}deg)`
                  }}
                >
                  <Image src={img} alt={col.name} fill className="object-cover border-4 border-white" />
                </div>
              ))}
            </div>
            <div className="absolute top-6 right-6 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
              {col.image_urls?.length || 0} Posters
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{col.name}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{col.description || "Premium Collection"}</p>
            </div>
            <span className="text-[#FF0000] text-2xl font-black">₹{col.price}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
