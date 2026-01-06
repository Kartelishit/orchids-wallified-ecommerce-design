"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const method = searchParams.get("method");
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase mb-4"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-500 text-sm font-bold uppercase tracking-widest"
          >
            Thank you for shopping with WALLIFIED
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-50 p-8 md:p-10 mb-8"
        >
          {orderId && (
            <div className="mb-8 pb-8 border-b border-zinc-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                Order ID
              </p>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm font-bold text-black break-all">
                  {orderId}
                </p>
                <button
                  onClick={handleCopyOrderId}
                  className="p-2 hover:bg-zinc-200 transition-colors rounded"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-zinc-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mb-8 pb-8 border-b border-zinc-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Payment Method
            </p>
            <p className="font-black text-sm uppercase">
              {method === "cod" ? "Cash on Delivery" : "Prepaid (Online Payment)"}
            </p>
            {method === "prepaid" && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                Payment Successful
              </span>
            )}
            {method === "cod" && (
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-widest">
                Pay on Delivery
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <p className="font-black text-sm uppercase mb-1">Order Processing</p>
                <p className="text-xs text-zinc-500">
                  Your order is being prepared with care
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-200 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-zinc-400" />
              </div>
              <div>
                <p className="font-black text-sm uppercase mb-1 text-zinc-400">
                  Shipping Soon
                </p>
                <p className="text-xs text-zinc-400">
                  Estimated delivery: 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-red-50 border-l-4 border-[#FF0000] p-6 mb-8"
        >
          <p className="text-sm font-bold text-black mb-1">
            Confirmation email sent!
          </p>
          <p className="text-xs text-zinc-500">
            Check your inbox for order details and tracking updates.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-3 bg-[#FF0000] text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-black transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-3 border-2 border-black text-black py-5 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Need help?
          </p>
          <p className="text-sm text-zinc-500">
            Contact us at{" "}
            <a
              href="mailto:support@wallified.in"
              className="text-[#FF0000] font-bold hover:underline"
            >
              support@wallified.in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-40 bg-white min-h-screen">
          <div className="container mx-auto px-6 text-center">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-[#FF0000] rounded-full animate-spin mx-auto" />
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
