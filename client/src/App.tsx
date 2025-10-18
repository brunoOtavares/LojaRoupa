import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Featured from "@/pages/Featured";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminProducts from "@/pages/AdminProducts";
import AdminKits from "@/pages/AdminKits";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/destaques" component={Featured} />
      <Route path="/contato" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminProducts} />
      <Route path="/admin/kits" component={AdminKits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
