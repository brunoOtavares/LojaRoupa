import { Cart } from "@/components/Cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="premium-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gold-border text-white hover:text-primary hover:bg-black/30">
                <ArrowLeft className="w-4 h-4" />
                Voltar para Loja
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-oswald font-bold uppercase tracking-wide gold-accent">Seu Carrinho</h1>
          </div>
          <Cart />
        </div>
      </main>
      <Footer />
    </div>
  );
}