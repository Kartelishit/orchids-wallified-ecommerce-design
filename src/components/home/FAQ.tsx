"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { question: "What is the quality of the posters?", answer: "All our posters are printed on high-quality 300GSM art board with a matte finish for a premium look and feel." },
  { question: "Do you offer free shipping?", answer: "Yes! We offer free shipping on all prepaid orders across India. For COD orders, a small shipping fee is applicable." },
  { question: "What if I receive a damaged product?", answer: "We have a solid replacement policy. If your poster arrives damaged, just send us a photo on WhatsApp and we'll send a replacement immediately." },
  { question: "Can I get a custom design printed?", answer: "Absolutely! Head over to our Custom Posters page or contact us on WhatsApp with your design requirements." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-[#FF0000] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">FAQ</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-zinc-100 pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-4 text-left group"
              >
                <span className={`text-lg font-black uppercase tracking-tight transition-colors ${openIndex === i ? "text-[#FF0000]" : "text-black"}`}>
                  {faq.question}
                </span>
                {openIndex === i ? <Minus className="text-[#FF0000]" /> : <Plus className="group-hover:text-[#FF0000] transition-colors" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-500 pb-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
