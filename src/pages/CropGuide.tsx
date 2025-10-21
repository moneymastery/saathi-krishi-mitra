import { CropGuideView } from "@/components/cropguide/CropGuideView";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";

const CropGuide = () => {
  return (
    <>
      <CropGuideView />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default CropGuide;
