import { ProductCard } from "./ProductCard";
import type { Product, Kit } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  items: (Product | Kit)[];
  isLoading?: boolean;
}

export function ProductGrid({ items, isLoading }: ProductGridProps) {
  const [filter, setFilter] = useState<"all" | "individual" | "kit">("all");

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "kit") return 'imageUrls' in item;
    return !('imageUrls' in item);
  });

  if (isLoading) {
    return (
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-medium" data-testid="text-products-title">
            Todos os Produtos
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              data-testid="button-filter-all"
            >
              Todos
            </Button>
            <Button
              variant={filter === "individual" ? "default" : "outline"}
              onClick={() => setFilter("individual")}
              data-testid="button-filter-individual"
            >
              Individuais
            </Button>
            <Button
              variant={filter === "kit" ? "default" : "outline"}
              onClick={() => setFilter("kit")}
              data-testid="button-filter-kits"
            >
              Kits
            </Button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg" data-testid="text-no-products">
              Nenhum produto encontrado
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map((item, index) => (
              <ProductCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
