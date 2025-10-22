import { Card } from "@/components/ui/card";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";
import { ShoppingBag } from "lucide-react";

const Marketplace = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-hero pb-24">
        <header className="px-6 pt-8 pb-6 bg-gradient-primary text-white">
          <h1 className="text-3xl font-bold mb-2">🛒 Marketplace</h1>
          <p className="text-sm opacity-90">Coming Soon</p>
        </header>

        <div className="px-6 py-8">
          <Card className="p-12 text-center bg-card/50 backdrop-blur">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Marketplace Under Development</h2>
            <p className="text-muted-foreground">
              Soon you'll be able to buy seeds, fertilizers, and farming equipment here.
            </p>
          </Card>
        </div>
      </div>
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default Marketplace;
