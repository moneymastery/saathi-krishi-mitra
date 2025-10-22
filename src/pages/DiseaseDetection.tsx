import { DiseaseDetectionView } from "@/components/disease/DiseaseDetectionView";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const DiseaseDetection = () => {
  return (
    <>
      <DiseaseDetectionView />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default DiseaseDetection;
