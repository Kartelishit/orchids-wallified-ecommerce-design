"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shippingFee = cartTotal >= 200 ? 0 : 50;
  const minCartValue = 200;

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4"
          >
            Your Cart
          </motion.h1>
          <div className="h-1 w-24 bg-[#FF0000]" />
        </div>

        {cart.length === 0 ? (
          <div className="py-40 text-center">
            <ShoppingBag size={64} className="mx-auto text-zinc-200 mb-8" />
            <p className="text-gray-400 text-xl font-bold uppercase tracking-widest mb-10">Your cart is empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#FF0000] text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 p-6 border border-zinc-100 items-center bg-white"
                  >
                    <div className="relative w-24 h-32 flex-shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-black uppercase tracking-tight">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-[#FF0000] transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size: {item.size || "A4"}</p>
                          {item.is_borderless && (
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1 h-1 bg-red-500 rounded-full" /> Borderless
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                        <div className="flex items-center border border-zinc-200">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-zinc-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-zinc-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-black text-[#FF0000]">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cartTotal < minCartValue && (
                <div className="p-4 bg-red-50 border-l-4 border-[#FF0000] text-[#FF0000] text-xs font-bold uppercase tracking-widest">
                  Add ₹{minCartValue - cartTotal} more to reach minimum order value of ₹200.
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 p-10 sticky top-40">
                <h4 className="text-sm font-black uppercase tracking-widest mb-8 border-b border-zinc-200 pb-4">Order Summary</h4>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-tight">Subtotal</span>
                    <span className="font-black text-black">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold tracking-tight">Shipping</span>
                    <span className={`font-black ${shippingFee === 0 ? "text-green-600" : "text-black"}`}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-right">
                      Free shipping on prepaid orders!
                    </p>
                  )}
                </div>
                <div className="flex justify-between text-xl font-black border-t border-zinc-200 pt-6 mb-10">
                  <span className="uppercase tracking-tighter text-black">Total</span>
                  <span className="text-[#FF0000]">₹{cartTotal + shippingFee}</span>
                </div>

                <Link
                  href={cartTotal >= minCartValue ? "/checkout" : "#"}
                  className={`w-full flex items-center justify-center gap-3 py-5 font-black uppercase tracking-widest text-xs transition-all ${
                    cartTotal >= minCartValue 
                    ? "bg-[#FF0000] text-white hover:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1" 
                    : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                
                <div className="mt-8 flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <p className="flex items-center gap-2">✓ COD available (extra fee)</p>
                  <p className="flex items-center gap-2">✓ Secure payment processing</p>
                  <p className="flex items-center gap-2">✓ 5-day replacement policy</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
