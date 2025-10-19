import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

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
      <main className="premium-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wide gold-accent mb-4" data-testid="text-page-title">
              Entre em Contato
            </h1>
            <div className="w-24 h-1 gold-gradient mx-auto rounded-full"></div>
          </div>
          <p className="text-white/80 text-xl text-center mb-12 font-roboto max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato através dos nossos canais
          </p>

          <div className="grid gap-8">
            {/* WhatsApp */}
            <div className="premium-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-8 h-8 text-[#25D366]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-wide text-black mb-3">WhatsApp</h3>
                    <p className="text-gray-600 mb-6 font-roboto text-lg">
                      Fale conosco diretamente e tire suas dúvidas sobre nossos produtos
                    </p>
                    <Button
                      onClick={handleWhatsApp}
                      className="premium-button"
                      data-testid="button-contact-whatsapp"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Abrir WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Instagram */}
            <div className="premium-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-wide text-black mb-3">Instagram</h3>
                    <p className="text-gray-600 mb-6 font-roboto text-lg">
                      Siga-nos no Instagram para ver nossas novidades e lançamentos
                    </p>
                    <Button
                      onClick={handleInstagram}
                      className="premium-button"
                      data-testid="button-contact-instagram"
                    >
                      <Instagram className="w-5 h-5" />
                      Seguir no Instagram
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Address */}
            <div className="premium-card">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-oswald font-bold uppercase tracking-wide text-black mb-3">Nossa Loja</h3>
                    <p className="text-gray-600 font-roboto text-lg" data-testid="text-address">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
