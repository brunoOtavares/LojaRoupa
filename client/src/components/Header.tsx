import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const navItems = [
    { path: "/", label: "Vitrine" },
    { path: "/destaques", label: "Destaques" },
    { path: "/contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-50 black-bg backdrop-blur-md border-b gold-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center hover-elevate active-elevate-2 rounded-xl px-4 py-3 -ml-4 cursor-pointer transition-all duration-300">
              <img
                src="/logoheader.png"
                alt="Michel Multimarcas Logo"
                className="w-20 h-20 object-contain filter drop-shadow-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-nav-${item.label.toLowerCase()}`}>
                <div
                  className={`px-6 py-3 rounded-xl text-base font-oswald font-semibold uppercase tracking-wide transition-all duration-300 hover-elevate active-elevate-2 cursor-pointer ${
                    location === item.path
                      ? "gold-accent bg-black/50"
                      : "text-white hover:text-primary hover:bg-black/30"
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-primary hover:bg-black/30 rounded-xl transition-all duration-300"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full gold-gradient text-black text-xs font-bold flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-primary hover:bg-black/30 rounded-xl transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t gold-border dark-gray-bg"
          >
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                  <div
                    className={`block px-4 py-4 rounded-xl text-base font-oswald font-semibold uppercase tracking-wide hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 ${
                      location === item.path
                        ? "gold-accent bg-black/50"
                        : "text-white hover:text-primary hover:bg-black/30"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
