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
    <div className="w-full max-w-md mx-auto bg-background rounded-xl border border-border shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Seu Carrinho</h2>
          <p className="text-sm text-muted-foreground">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>
        
        <div className="flex flex-col max-h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-8.3H6.03"></path>
                  </svg>
                </div>
                <p className="text-muted-foreground font-medium">
                  Seu carrinho está vazio
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione produtos para continuar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border border-border rounded-lg bg-secondary/10 hover-elevate transition-all">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-border"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate text-foreground">{item.name}</h4>
                      <Badge variant="secondary" className="text-xs mb-2 inline-block bg-accent text-accent-foreground border-border">
                        {item.type === 'kit' ? 'Conjunto' : 'Produto'}
                      </Badge>
                      <p className="text-sm font-bold text-primary">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-full bg-background border-border text-foreground hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-full bg-background border-border text-foreground hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t border-border bg-secondary/20 p-4 space-y-3 flex-shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Subtotal:</span>
                <span className="text-sm text-foreground">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1 h-10 rounded-lg bg-background border-border text-foreground hover:bg-accent"
                >
                  Limpar Carrinho
                </Button>
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2 h-10 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Pedir no WhatsApp
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}