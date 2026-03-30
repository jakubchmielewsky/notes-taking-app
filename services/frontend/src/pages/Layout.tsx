import { Outlet } from "react-router-dom";
import DesktopSidebar from "@/components/desktop/DesktopSidebar";
import DesktopHeader from "@/components/desktop/DesktopHeader";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileMenuBar from "@/components/mobile/MobileMenuBar";
import NotificationsContainer from "@/components/ui/NotificationsContainer";

const Layout: React.FC = () => {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen flex flex-col desktop:flex-row bg-neutral-0 dark:bg-neutral-950 overflow-hidden">
      <MobileHeader />
      <DesktopSidebar />
      <div className="grow flex flex-col overflow-hidden">
        <DesktopHeader />
        <div
          className="grow overflow-y-auto desktop:overflow-hidden
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-neutral-200
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800"
        >
          <Outlet />
        </div>
      </div>
      <MobileMenuBar />
      <NotificationsContainer />
    </div>
  );
};

export default Layout;
