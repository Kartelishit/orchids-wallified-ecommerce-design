import { supabase } from "@/lib/supabase";
import ProductDetails from "./ProductDetails";

export const revalidate = 3600;

async function getProduct(id: string) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();
  return data;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="py-40 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
