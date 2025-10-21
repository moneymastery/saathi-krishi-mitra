import { SoilSatiView } from "@/components/soilsati/SoilSatiView";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";

const SoilSati = () => {
  return (
    <>
      <SoilSatiView />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default SoilSati;
