import { DashboardView } from "@/components/dashboard/DashboardView";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";

const Dashboard = () => {
  return (
    <>
      <DashboardView />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default Dashboard;
