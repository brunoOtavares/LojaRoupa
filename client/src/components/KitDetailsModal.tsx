import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X } from "lucide-react";
import type { Kit, Product } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";

interface KitDetailsModalProps {
  kit: Kit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KitDetailsModal({ kit, open, onOpenChange }: KitDetailsModalProps) {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  const { addToCart } = useCart();

  const kitProducts = products.filter(p => kit?.productIds.includes(p.id));

  const handleAddKitToCart = () => {
    if (!kit) return;
    addToCart(kit, 'kit');
    onOpenChange(false);
  };

  const handleAddProductToCart = (product: Product) => {
    addToCart(product, 'product');
  };

  if (!kit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {kit.name}
              <Badge variant="secondary">Conjunto</Badge>
              {kit.isFeatured && (
                <Badge className="bg-primary text-primary-foreground">Destaque</Badge>
              )}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Kit Image */}
          <div className="aspect-[3/4] max-w-sm mx-auto">
            <img
              src={kit.imageUrl}
              alt={kit.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Kit Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground">{kit.description}</p>
          </div>

          {/* Products in Kit */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Produtos incluídos ({kitProducts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kitProducts.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddProductToCart(product)}
                      className="mt-2 gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Preço total do conjunto:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {kit.price.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleAddKitToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Adicionar Conjunto ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}