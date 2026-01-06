"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-12">
            Privacy Policy
          </h1>
          <div className="h-1 w-24 bg-[#FF0000] mb-12" />
          
          <div className="prose prose-zinc prose-sm md:prose-base max-w-none text-gray-500 space-y-8 font-medium">
            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Information We Collect</h2>
              <p>We collect information you provide directly to us when you place an order, create an account, or contact us for support. This includes your name, email, phone number, and shipping address.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">How We Use Your Data</h2>
              <p>Your data is used solely to process your orders, provide customer support, and send you updates about your purchase. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Security</h2>
              <p>We use industry-standard security measures to protect your personal data. Payments are processed securely through Stripe, and we do not store your card details on our servers.</p>
            </section>

            <section>
              <h2 className="text-black font-black uppercase tracking-tight text-xl mb-4">Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information at any time. Contact us at support@wallified.com for any privacy-related concerns.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
