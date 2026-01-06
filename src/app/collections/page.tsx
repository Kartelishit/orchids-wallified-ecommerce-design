import { supabase } from "@/lib/supabase";
import CollectionsList from "./CollectionsList";

export const revalidate = 3600;

async function getCollections() {
  const { data } = await supabase
    .from('collections')
    .select('*');
  return data || [];
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4">
            Poster Collections
          </h1>
          <div className="h-1 w-24 bg-[#FF0000]" />
        </div>

        <CollectionsList collections={collections} />
      </div>
    </div>
  );
}
