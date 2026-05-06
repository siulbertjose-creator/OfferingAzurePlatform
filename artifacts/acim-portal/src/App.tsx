import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import OfferingDetail from "@/pages/offering-detail";
import CaseDetail from "@/pages/case-detail";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOfferings from "@/pages/admin/offerings";
import AdminOfferingForm from "@/pages/admin/offering-form";
import AdminUseCaseForm from "@/pages/admin/use-case-form";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/offerings/:id" component={OfferingDetail} />
      <Route path="/cases/:id" component={CaseDetail} />

      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/offerings" component={AdminOfferings} />
      <Route path="/admin/offerings/new" component={AdminOfferingForm} />
      <Route path="/admin/offerings/:id/edit" component={AdminOfferingForm} />
      <Route path="/admin/use-cases/new" component={AdminUseCaseForm} />
      <Route path="/admin/use-cases/:id/edit" component={AdminUseCaseForm} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
