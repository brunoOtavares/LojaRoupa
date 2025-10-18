import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import type { Product, Kit } from "@shared/schema";

export default function Featured() {
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: kits = [], isLoading: kitsLoading } = useQuery<Kit[]>({
    queryKey: ['/api/kits'],
  });

  const allItems = [...products, ...kits];
  const featuredItems = allItems.filter(item => item.isFeatured);
  const isLoading = productsLoading || kitsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            Itens em Destaque
          </h1>
          <p className="text-muted-foreground text-lg mb-12">
            Nossa seleção especial dos melhores produtos
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg" data-testid="text-no-featured">
                Nenhum item em destaque no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredItems.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
