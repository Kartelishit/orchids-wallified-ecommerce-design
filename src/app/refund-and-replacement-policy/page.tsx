"use client";

import { motion } from "framer-motion";

export default function RefundPolicyPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-12">
            Refund & Replacement
          </h1>
          <div className="h-1 w-24 bg-[#FF0000] mb-12" />
          
          <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-gray-500 space-y-8 font-medium">
            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">No Refund Policy</h2>
              <p>At WALLIFIED, we print each poster specifically for your order. Because of this personalized nature, <strong className="text-black italic">we do not offer refunds</strong> once an order has been processed and printed.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Replacement Policy</h2>
              <p>We do, however, offer a rock-solid replacement policy. We will replace your product if:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The product arrived damaged during transit.</li>
                <li>The print quality has visible defects.</li>
                <li>The wrong product was delivered.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">How to Request a Replacement</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Capture a clear photo/video of the damaged product and the packaging.</li>
                <li>Send the details along with your Order ID to our WhatsApp support within 48 hours of delivery.</li>
                <li>Once verified, we will ship a fresh replacement to you at no extra cost.</li>
              </ol>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
