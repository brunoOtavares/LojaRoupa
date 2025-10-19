import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag, Package, Grid3x3 } from "lucide-react";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import type { AdminUser } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setLocation("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado",
        description: "Você saiu do painel administrativo",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 black-bg backdrop-blur-md border-b gold-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <div className="flex items-center hover-elevate active-elevate-2 rounded-xl px-4 py-3 -ml-4 cursor-pointer transition-all duration-300">
              <img
                src="/logoheader.png"
                alt="Michel Multimarcas Logo"
                className="w-20 h-20 object-contain filter drop-shadow-lg"
              />
              <span className="text-lg font-oswald font-bold uppercase tracking-wide text-white ml-3">Admin</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80 hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 border-gold-border text-white hover:text-primary hover:bg-black/30 rounded-xl"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border dark-gray-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto py-4">
            <Button
              variant={location === "/admin/kits" || location === "/admin" ? "default" : "ghost"}
              onClick={() => setLocation("/admin/kits")}
              className={`gap-2 flex-shrink-0 px-6 py-3 rounded-xl text-base font-oswald font-semibold uppercase tracking-wide transition-all duration-300 hover-elevate active-elevate-2 ${
                location === "/admin/kits" || location === "/admin"
                  ? "gold-accent bg-black/50"
                  : "text-white hover:text-primary hover:bg-black/30"
              }`}
              data-testid="button-nav-kits"
            >
              <Grid3x3 className="w-4 h-4" />
              Conjuntos
            </Button>
            <Button
              variant={location === "/admin/produtos" ? "default" : "ghost"}
              onClick={() => setLocation("/admin/produtos")}
              className={`gap-2 flex-shrink-0 px-6 py-3 rounded-xl text-base font-oswald font-semibold uppercase tracking-wide transition-all duration-300 hover-elevate active-elevate-2 ${
                location === "/admin/produtos"
                  ? "gold-accent bg-black/50"
                  : "text-white hover:text-primary hover:bg-black/30"
              }`}
              data-testid="button-nav-products"
            >
              <Package className="w-4 h-4" />
              Produtos
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}
