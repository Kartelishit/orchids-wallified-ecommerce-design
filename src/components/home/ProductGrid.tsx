"use client";

import ProductCard, { Product } from "./ProductCard";

export default function ProductGrid({ products, title, subtitle }: { products: Product[], title: string, subtitle?: string }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="text-[#FF0000] font-black uppercase tracking-[0.3em] text-xs mb-4 block">{subtitle || "Shop Now"}</span>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
