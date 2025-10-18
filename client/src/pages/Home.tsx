import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ProductGrid } from "@/components/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import type { Product, Kit } from "@shared/schema";

export default function Home() {
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: kits = [], isLoading: kitsLoading } = useQuery<Kit[]>({
    queryKey: ['/api/kits'],
  });

  const allItems = [...products, ...kits];
  const isLoading = productsLoading || kitsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedSection items={allItems} isLoading={isLoading} />
        <ProductGrid items={allItems} isLoading={isLoading} />
      </main>
    </div>
  );
}
