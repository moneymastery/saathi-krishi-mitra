import { ProfileView } from "@/components/profile/ProfileView";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AIAdvisorFAB } from "@/components/layout/AIAdvisorFAB";

const Profile = () => {
  return (
    <>
      <ProfileView />
      <AIAdvisorFAB />
      <BottomNavigation />
    </>
  );
};

export default Profile;
