import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { speechService } from "./services/SpeechService";
import Navbar from "./components/Navbar";
import SOSButton from "./components/SOSButton";
import WelcomePopup from "./components/WelcomePopup";
import HealthChatbot from "./components/HealthChatbot";
import Home from "./pages/Home";
import Education from "./pages/Education";
import Healthcare from "./pages/Healthcare";
import Literacy from "./pages/Literacy";
import Emergency from "./pages/Emergency";
import Misconceptions from "./pages/Misconceptions";
import Dashboard from "./pages/Dashboard";
import AskDoctor from "./pages/AskDoctor";
import HealthLocator from "./pages/HealthLocator";
import NotFound from "./pages/NotFound";
import HealthTipsBanner from "./components/HealthTipsBanner";

const queryClient = new QueryClient();

// Component to handle navigation side-effects
const StopSpeakingOnNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    speechService.stop();
  }, [location]);

  return null;
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <StopSpeakingOnNavigation />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <HealthTipsBanner />
                <main className="flex-1">
                  <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading translations...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/education" element={<Education />} />
                      <Route path="/healthcare" element={<Healthcare />} />
                      <Route path="/literacy" element={<Literacy />} />
                      <Route path="/emergency" element={<Emergency />} />
                      <Route path="/misconceptions" element={<Misconceptions />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/ask-doctor" element={<AskDoctor />} />
                      <Route path="/locator" element={<HealthLocator />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </React.Suspense>
                </main>
                <SOSButton />
                <WelcomePopup />
                <HealthChatbot />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
