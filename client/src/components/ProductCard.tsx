import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, Kit } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { KitDetailsModal } from "./KitDetailsModal";

interface ProductCardProps {
  item: Product | Kit;
  index?: number;
}

export function ProductCard({ item, index = 0 }: ProductCardProps) {
  const [showKitDetails, setShowKitDetails] = useState(false);
  const { addToCart } = useCart();
  const isKit = 'productIds' in item;
  const imageUrl = item.imageUrl;

  const handleAddToCart = () => {
    addToCart(item, isKit ? 'kit' : 'product');
  };

  const handleCardClick = () => {
    if (isKit) {
      setShowKitDetails(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <div
          className={`premium-card group feminine-hover feminine-transition ${
            isKit ? 'cursor-pointer' : ''
          }`}
          onClick={handleCardClick}
        >
          <div className="relative aspect-[3/4] overflow-hidden white-bg">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-testid={`img-product-${item.id}`}
            />
            {item.isFeatured && (
              <Badge className="absolute top-4 right-4 pink-gradient text-white font-serif font-semibold text-xs px-3 py-1 rounded-full">
                Destaque
              </Badge>
            )}
            {isKit && (
              <Badge className="absolute top-4 left-4 light-pink-bg text-gray-700 font-serif font-semibold text-xs px-3 py-1 rounded-full">
                Conjunto
              </Badge>
            )}
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold tracking-wide text-gray-800 line-clamp-1" data-testid={`text-name-${item.id}`}>
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 font-sans" data-testid={`text-description-${item.id}`}>
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-2xl font-serif font-bold pink-accent" data-testid={`text-price-${item.id}`}>
                R$ {item.price.toFixed(2)}
              </span>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="premium-button text-sm px-4 py-2 feminine-button"
                data-testid={`button-add-to-cart-${item.id}`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Adicionar</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {isKit && (
        <KitDetailsModal
          kit={item as Kit}
          open={showKitDetails}
          onOpenChange={setShowKitDetails}
        />
      )}
    </>
  );
}
