import { FieldDetailsDashboard } from "@/components/soilsati/FieldDetailsDashboard";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const FieldDetails = () => {
  return (
    <>
      <FieldDetailsDashboard />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default FieldDetails;
