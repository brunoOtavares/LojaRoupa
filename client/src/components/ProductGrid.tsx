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
    if (filter === "kit") return 'productIds' in item;
    return !('productIds' in item);
  });

  if (isLoading) {
    return (
      <section id="products" className="premium-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse space-y-12">
            <div className="text-center">
              <div className="h-8 dark-gray-bg rounded-lg w-1/4 mx-auto mb-4"></div>
              <div className="w-8 h-1 gold-gradient mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}>
                  <div className="aspect-[3/4] ice-white-bg rounded-2xl mb-6 shadow-lg"></div>
                  <div className="h-4 dark-gray-bg rounded-lg mb-3"></div>
                  <div className="h-3 dark-gray-bg rounded-lg w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="premium-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wide gold-accent mb-4" data-testid="text-products-title">
              Todos os Produtos
            </h2>
            <div className="w-24 h-1 gold-gradient mx-auto lg:mx-0 rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-xl px-6 py-3 font-oswald font-semibold uppercase tracking-wide transition-all duration-"
              data-testid="button-filter-all"
            >
              Todos
            </Button>
            <Button
              variant={filter === "individual" ? "default" : "outline"}
              onClick={() => setFilter("individual")}
              className="rounded-xl px-6 py-3 font-oswald font-semibold uppercase tracking-wide transition-all duration-"
              data-testid="button-filter-individual"
            >
              Individuais
            </Button>
            <Button
              variant={filter === "kit" ? "default" : "outline"}
              onClick={() => setFilter("kit")}
              className="rounded-xl px-6 py-3 font-oswald font-semibold uppercase tracking-wide transition-all duration-"
              data-testid="button-filter-kits"
            >
              Conjuntos
            </Button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/70 text-xl font-roboto" data-testid="text-no-products">
              Nenhum produto encontrado
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item, index) => (
              <ProductCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
