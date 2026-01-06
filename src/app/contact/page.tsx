"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-12">
              Contact Us
            </h1>
            <div className="h-1 w-24 bg-[#FF0000] mb-12" />
            
            <p className="text-gray-500 text-lg mb-12 max-w-md font-medium">
              Have a question about your order or want to discuss a custom design? We're here to help!
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                  <Mail className="text-[#FF0000] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Us</p>
                  <p className="font-bold text-black">support@wallified.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                  <MessageSquare className="text-[#FF0000] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">WhatsApp</p>
                  <p className="font-bold text-black">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-zinc-50 flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                  <Clock className="text-[#FF0000] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Working Hours</p>
                  <p className="font-bold text-black">Mon - Sat | 10AM - 7PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-50 p-10 md:p-12"
          >
            <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Name</label>
                  <input type="text" className="w-full bg-white border border-zinc-100 p-4 focus:border-[#FF0000] outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email</label>
                  <input type="email" className="w-full bg-white border border-zinc-100 p-4 focus:border-[#FF0000] outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Subject</label>
                <input type="text" className="w-full bg-white border border-zinc-100 p-4 focus:border-[#FF0000] outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Message</label>
                <textarea rows={4} className="w-full bg-white border border-zinc-100 p-4 focus:border-[#FF0000] outline-none font-bold resize-none"></textarea>
              </div>
              <button className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-[#FF0000] transition-colors flex items-center justify-center gap-3">
                Send Message <Send size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
