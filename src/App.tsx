import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SoilSati from "./pages/SoilSati";
import FieldMapping from "./pages/FieldMapping";
import FieldDetails from "./pages/FieldDetails";
import DiseaseDetection from "./pages/DiseaseDetection";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/soilsati" replace />} />
          <Route path="/soilsati" element={<SoilSati />} />
          <Route path="/soilsati/map-field" element={<FieldMapping />} />
          <Route path="/soilsati/field/:fieldId" element={<FieldDetails />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
