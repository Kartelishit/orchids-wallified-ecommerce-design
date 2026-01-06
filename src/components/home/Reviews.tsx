"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Rahul S.", rating: 5, text: "Quality is insane! The colors are so vibrant and the paper is thick." },
  { name: "Ananya P.", rating: 5, text: "Ordered the Anime Trio, looks amazing on my wall. Fast delivery too." },
  { name: "Vikram M.", rating: 4, text: "Packaging was solid. No bends at all. Highly recommend Wallified." }
];

export default function Reviews() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#FF0000] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">Wall of Fame</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 border border-zinc-100 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#FF0000] text-[#FF0000]" />
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-6">"{review.text}"</p>
              <span className="font-black uppercase tracking-widest text-xs">- {review.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
