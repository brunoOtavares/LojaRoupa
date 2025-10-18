import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, Kit } from "@shared/schema";
import { generateWhatsAppLink, STORE_WHATSAPP } from "@/lib/whatsapp";

interface ProductCardProps {
  item: Product | Kit;
  index?: number;
}

export function ProductCard({ item, index = 0 }: ProductCardProps) {
  const isKit = 'imageUrls' in item;
  const imageUrl = isKit ? item.imageUrls[0] : item.imageUrl;

  const handleWhatsAppClick = () => {
    const link = generateWhatsAppLink(item, STORE_WHATSAPP);
    window.open(link, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 group">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`img-product-${item.id}`}
          />
          {item.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              Destaque
            </Badge>
          )}
          {isKit && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              Kit
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-lg font-medium line-clamp-1" data-testid={`text-name-${item.id}`}>
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${item.id}`}>
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl font-bold text-primary" data-testid={`text-price-${item.id}`}>
              R$ {item.price.toFixed(2)}
            </span>
            
            <Button
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2"
              data-testid={`button-whatsapp-${item.id}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
