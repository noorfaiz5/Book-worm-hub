import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import { AddBookModal } from "@/components/AddBookModal";
import { Dashboard } from "@/pages/Dashboard";
import Books from "@/pages/Books";
import Challenge from "@/pages/Challenge";
import Stats from "@/pages/Stats";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function AppContent() {
  const { user, loading } = useAuth();
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isVisible={true} onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navigation onAddBook={() => setShowAddBookModal(true)} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/books" component={Books} />
        <Route path="/challenge" component={Challenge} />
        <Route path="/stats" component={Stats} />
        <Route component={NotFound} />
      </Switch>
      <AddBookModal 
        isVisible={showAddBookModal} 
        onClose={() => setShowAddBookModal(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
