import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
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
      <main className="premium-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wide gold-accent mb-4" data-testid="text-page-title">
              Itens em Destaque
            </h1>
            <div className="w-24 h-1 gold-gradient mx-auto rounded-full"></div>
          </div>
          <p className="text-white/80 text-xl text-center mb-12 font-roboto max-w-3xl mx-auto">
            Nossa seleção especial dos melhores produtos
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] ice-white-bg rounded-2xl mb-6 shadow-lg"></div>
                  <div className="h-4 dark-gray-bg rounded-lg mb-3"></div>
                  <div className="h-3 dark-gray-bg rounded-lg w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/70 text-xl font-roboto" data-testid="text-no-featured">
                Nenhum item em destaque no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredItems.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
