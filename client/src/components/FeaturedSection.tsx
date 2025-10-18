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
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12">
            Itens em Destaque
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-medium mb-8 md:mb-12" data-testid="text-featured-title">
          Itens em Destaque
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {featuredItems.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
