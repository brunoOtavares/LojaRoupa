import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const contactInfo = {
    whatsapp: "5511999999999",
    instagram: "https://instagram.com/sualojaaqui",
    address: "Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567",
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank');
  };

  const handleInstagram = () => {
    window.open(contactInfo.instagram, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            Entre em Contato
          </h1>
          <p className="text-muted-foreground text-lg mb-12">
            Estamos aqui para ajudar! Entre em contato através dos nossos canais
          </p>

          <div className="grid gap-6">
            {/* WhatsApp */}
            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground mb-4">
                      Fale conosco diretamente e tire suas dúvidas sobre nossos produtos
                    </p>
                    <Button
                      onClick={handleWhatsApp}
                      className="bg-[#25D366] hover:bg-[#20BA5A] text-white gap-2"
                      data-testid="button-contact-whatsapp"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Abrir WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instagram */}
            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2">Instagram</h3>
                    <p className="text-muted-foreground mb-4">
                      Siga-nos no Instagram para ver nossas novidades e lançamentos
                    </p>
                    <Button
                      onClick={handleInstagram}
                      variant="outline"
                      className="gap-2"
                      data-testid="button-contact-instagram"
                    >
                      <Instagram className="w-4 h-4" />
                      Seguir no Instagram
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2">Nossa Loja</h3>
                    <p className="text-muted-foreground" data-testid="text-address">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
