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
      {/* Background com imagem feminina */}
      <div className="absolute inset-0">
        <img
          src="/img/loja_de_roupas_recife.webp"
          alt="Fashion Store Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay com gradiente rosa suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink/60 via-pink/40 to-pink/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-white uppercase tracking-wide drop-shadow-lg feminine-float"
              animate={{
                textShadow: [
                  "0 2px 4px rgba(219, 112, 147, 0.3)",
                  "0 4px 8px rgba(219, 112, 147, 0.5)",
                  "0 2px 4px rgba(219, 112, 147, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Elegância em cada detalhe
            </motion.h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto font-sans leading-relaxed drop-shadow">
              Peças pensadas para a mulher moderna que valoriza estilo, sofisticação e autenticidade em cada momento.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="premium-button text-base md:text-lg px-6 md:px-8 py-3 md:py-4 mt-6 md:mt-8 feminine-button"
                data-testid="button-explore-collection"
              >
                Explorar Coleção
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Elemento decorativo inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-pink/20 to-transparent"></div>
    </section>
  );
}
