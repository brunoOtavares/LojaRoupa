import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { STORE_WHATSAPP } from "@/lib/whatsapp";

export function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();
  
  const { toast } = useToast();

  const handleWhatsAppClick = () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de pedir via WhatsApp",
        variant: "destructive",
      });
      return;
    }

    const itemsList = items.map(item => {
      const itemType = item.type === 'kit' ? 'Conjunto' : 'Produto';
      return `${itemType}: ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const message = `Olá! Gostaria de fazer um pedido dos seguintes itens:\n\n${itemsList}\n\nTotal: R$ ${getTotalPrice().toFixed(2)}\n\nGostaria de confirmar a disponibilidade e o pagamento.`;
    
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = STORE_WHATSAPP.replace(/\D/g, '');
    const link = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    window.open(link, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Seu Carrinho</h2>
          <p className="text-sm text-muted-foreground">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>
        
        <div className="flex flex-col max-h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Seu carrinho está vazio
              </p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-2 p-2 border rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs mb-1">
                        {item.type === 'kit' ? 'Conjunto' : 'Produto'}
                      </Badge>
                      <p className="text-xs font-bold text-primary">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-2 h-2" />
                        </Button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-2 h-2" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 ml-auto text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-2 h-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t pt-2 space-y-2 flex-shrink-0">
              <div className="flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 text-xs h-8"
                >
                  Limpar
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white gap-1 text-xs h-8"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}