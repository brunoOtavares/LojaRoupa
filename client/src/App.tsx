import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";
import Home from "@/pages/Home";
import Featured from "@/pages/Featured";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminProducts from "@/pages/AdminProducts";
import AdminKits from "@/pages/AdminKits";
import CartPage from "@/pages/CartPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/destaques" component={Featured} />
      <Route path="/contato" component={Contact} />
      <Route path="/cart" component={CartPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminKits} />
      <Route path="/admin/kits" component={AdminKits} />
      <Route path="/admin/produtos" component={AdminProducts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
