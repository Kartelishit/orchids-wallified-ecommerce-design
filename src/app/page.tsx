import Hero from "@/components/home/Hero";
import CollectionStrip from "@/components/home/CollectionStrip";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import WhyChooseWallified from "@/components/home/WhyChooseWallified";
import ProductGrid from "@/components/home/ProductGrid";
import PosterKits from "@/components/home/PosterKits";
import Reviews from "@/components/home/Reviews";
import FAQ from "@/components/home/FAQ";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // revalidate every hour

async function getProducts() {
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true)
    .limit(4);

  const { data: trending } = await supabase
    .from('products')
    .select('*')
    .eq('is_trending', true)
    .limit(4);

  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .limit(2);

  return {
    bestSellers: bestSellers || [],
    trending: trending || [],
    collections: collections || []
  };
}

export default async function Home() {
  const { bestSellers, trending, collections } = await getProducts();

  return (
    <div className="flex flex-col">
      <Hero />
      <CollectionStrip />
      <FeaturedCollections collections={collections} />
      <WhyChooseWallified />
      <ProductGrid products={bestSellers} title="Best Selling" subtitle="The Crowd Favorites" />
      <ProductGrid products={trending} title="Trending Posters" subtitle="What's Hot Right Now" />
      <PosterKits />
      <WhyChooseWallified short />
      <Reviews />
      <FAQ />
    </div>
  );
}
