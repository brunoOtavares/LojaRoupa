import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background com textura de tecido */}
      <div className="absolute inset-0 black-gradient">
        {/* Overlay com textura sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/50"></div>
        </div>
      </div>

      {/* Logo de fundo com opacidade reduzida */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-5">
        <img
          src="/img/logo.jpg"
          alt="Logo Background"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-oswald gold-accent uppercase tracking-wide">
              Autenticidade em cada detalhe
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-roboto leading-relaxed">
              Peças pensadas pra quem vive o dia a dia com atitude e personalidade, sem precisar forçar nada.
            </p>
            <Button
              onClick={scrollToProducts}
              size="lg"
              className="premium-button text-base md:text-lg px-6 md:px-8 py-3 md:py-4 mt-6 md:mt-8"
              data-testid="button-explore-collection"
            >
              Explorar Coleção
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Elemento decorativo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
