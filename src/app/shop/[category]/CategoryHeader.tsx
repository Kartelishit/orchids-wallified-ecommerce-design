"use client";

import { motion } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4"
        >
          {title}
        </motion.h1>
        <div className="h-1 w-24 bg-[#FF0000]" />
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-zinc-200 px-6 py-3 font-bold uppercase tracking-widest text-xs hover:border-[#FF0000] transition-colors">
          <Filter size={16} /> Filter
        </button>
        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-zinc-200 px-6 py-3 font-bold uppercase tracking-widest text-xs hover:border-[#FF0000] transition-colors">
          <SlidersHorizontal size={16} /> Sort
        </button>
      </div>
    </div>
  );
}
