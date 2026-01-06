"use client";

import { motion } from "framer-motion";

export default function ShippingPolicyPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-12">
            Shipping Policy
          </h1>
          <div className="h-1 w-24 bg-[#FF0000] mb-12" />
          
          <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-gray-500 space-y-8 font-medium">
            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Domestic Shipping</h2>
              <p>We ship all across India. Most orders are processed within 24-48 hours. Depending on your location, delivery takes between 3 to 7 business days.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Shipping Rates</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-black">Prepaid Orders:</strong> FREE Shipping across India.</li>
                <li><strong className="text-black">COD Orders:</strong> A small handling fee of ₹50 is applicable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Tracking Your Order</h2>
              <p>Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can use this link to track your package in real-time.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Packaging Safety</h2>
              <p>We take pride in our secure packaging. All posters are shipped in heavy-duty tubes or flat-packed with multiple layers of protection to ensure they reach you in perfect condition.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
