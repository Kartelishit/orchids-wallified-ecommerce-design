import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/home/ProductCard";
import { Filter, SlidersHorizontal } from "lucide-react";
import CategoryHeader from "./CategoryHeader";

export const revalidate = 3600;

async function getProducts(categorySlug: string) {
  let query = supabase.from('products').select('*');

  if (categorySlug !== 'all-posters' && categorySlug !== 'shop') {
    // Get category id first
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }

  const { data: products } = await query;
  return products || [];
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decodedCategory = category === "all-posters" || category === "shop" 
    ? "All Posters" 
    : category.replace(/-/g, " ");
  
  const products = await getProducts(category);

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <CategoryHeader title={decodedCategory} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">No posters found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
