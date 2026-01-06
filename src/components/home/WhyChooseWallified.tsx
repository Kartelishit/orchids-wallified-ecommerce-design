"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Truck, Palette, Package, Clock } from "lucide-react";

const features = [
  { icon: Palette, title: "300GSM ART BOARD", desc: "Non-tearable, water-resistant premium prints." },
  { icon: Zap, title: "CUSTOM DESIGNER", desc: "Our team helps you create your dream posters." },
  { icon: Truck, title: "FREE EXPRESS SHIPPING", desc: "Complimentary shipping on all prepaid orders." },
  { icon: ShieldCheck, title: "SAFE ARRIVAL", desc: "Damage-proof packaging ensures perfect delivery." },
  { icon: Clock, title: "48H DISPATCH", desc: "We ship your posters within 48 hours, guaranteed." },
  { icon: Package, title: "EASY REPLACEMENT", desc: "Received a damaged print? We'll replace it for free." }
];

export default function WhyChooseWallified({ short = false }: { short?: boolean }) {
  const displayFeatures = short ? features.slice(0, 3) : features;

  return (
    <section className={`py-32 ${short ? "bg-white" : "bg-black text-white"}`}>
      <div className="container mx-auto px-6">
        {!short && (
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#FF0000] font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">The Wallified Edge</span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">Why settle <br /> for average?</h2>
            </div>
            <p className="text-zinc-500 text-lg md:text-xl font-medium uppercase tracking-tight max-w-xs">
              We don't just sell posters. We sell personality for your walls.
            </p>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 ${short ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-px bg-zinc-800/20 border border-zinc-800/20`}>
          {displayFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`${short ? "bg-white text-black p-12" : "bg-black text-white p-16"} group hover:bg-[#FF0000] transition-all duration-500 cursor-default`}
            >
              <feature.icon className={`w-12 h-12 mb-10 transition-transform group-hover:scale-110 group-hover:text-white ${short ? "text-[#FF0000]" : "text-[#FF0000]"}`} />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className={`text-sm font-medium leading-relaxed group-hover:text-white/80 transition-colors ${short ? "text-zinc-400" : "text-zinc-500"}`}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
