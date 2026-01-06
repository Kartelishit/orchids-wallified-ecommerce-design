"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Anime", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=200&auto=format&fit=crop" },
  { name: "Movies", image: "https://images.unsplash.com/photo-1594908900066-3f4f9b47f7d5?q=80&w=200&auto=format&fit=crop" },
  { name: "Music", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop" },
  { name: "Sports", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=200&auto=format&fit=crop" },
  { name: "Aesthetic", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop" },
  { name: "Custom", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&auto=format&fit=crop" },
];

export default function CollectionStrip() {
  return (
    <div className="bg-white py-12 border-y border-zinc-100">
      <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-10 items-center min-w-max pb-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/shop/${cat.name.toLowerCase()}`} className="flex flex-col items-center gap-3 group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#FF0000] transition-all p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-black">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
