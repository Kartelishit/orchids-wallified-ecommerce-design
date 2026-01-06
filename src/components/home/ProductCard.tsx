"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_best_seller?: boolean;
  is_trending?: boolean;
}

export default function ProductCard({ product, index }: { product: Product, index: number }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-zinc-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {product.is_best_seller && (
          <div className="absolute top-4 left-4 bg-[#FF0000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
            Best Seller
          </div>
        )}
        <button
          onClick={() => addToCart({ ...product, quantity: 1 })}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-4 font-black uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#FF0000]"
        >
          Add to Cart
        </button>
      </div>
      <Link href={`/product/${product.id}`}>
        <h3 className="text-sm font-black uppercase tracking-tight mb-1 group-hover:text-[#FF0000] transition-colors">{product.name}</h3>
        <p className="text-[#FF0000] font-black">₹{product.price}</p>
      </Link>
    </motion.div>
  );
}
