import { ProductCard } from "./ProductCard";
import type { Product, Kit } from "@shared/schema";

interface FeaturedSectionProps {
  items: (Product | Kit)[];
  isLoading?: boolean;
}

export function FeaturedSection({ items, isLoading }: FeaturedSectionProps) {
  const featuredItems = items.filter(item => item.isFeatured);

  if (isLoading) {
    return (
      <section className="premium-section-light">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-wide pink-accent mb-4">
              Itens em Destaque
            </h2>
            <div className="w-24 h-1 pink-gradient mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] white-bg rounded-3xl mb-6 shadow-lg"></div>
                <div className="h-4 light-pink-bg rounded-lg mb-3"></div>
                <div className="h-3 light-pink-bg rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="premium-section-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-wide pink-accent mb-4" data-testid="text-featured-title">
            Itens em Destaque
          </h2>
          <div className="w-24 h-1 pink-gradient mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
