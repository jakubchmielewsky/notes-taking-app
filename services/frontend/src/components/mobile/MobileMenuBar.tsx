import HomeIcon from "@/assets/icons/icon-home.svg?react";
import SearchIcon from "@/assets/icons/icon-search.svg?react";
import ArchiveIcon from "@/assets/icons/icon-archive.svg?react";
import TagIcon from "@/assets/icons/icon-tag.svg?react";
import SettingsIcon from "@/assets/icons/icon-settings.svg?react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { Icon: HomeIcon, label: "Home", route: "/home" },
  { Icon: SearchIcon, label: "Search", route: "/search" },
  { Icon: ArchiveIcon, label: "Archived", route: "/archived" },
  { Icon: TagIcon, label: "Tag", route: "/tag" },
  { Icon: SettingsIcon, label: "Settings", route: "/settings" },
];

const MobileMenuBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="desktop:hidden w-full px-200 py-150 shadow-top dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <ul className="flex tablet:divide-x divide-neutral-100 dark:divide-neutral-800">
        {menuItems.map(({ Icon, label, route }) => {
          const isActive = location.pathname.startsWith(route);
          return (
            <li key={route} className="grow text-center">
              <button
                onClick={() => navigate(route)}
                className={`w-full max-w-[80px] mx-auto py-050 flex justify-center rounded-4 ${
                  isActive ? "bg-blue-50 dark:bg-neutral-800" : ""
                }`}
              >
                <div
                  className={`flex flex-col items-center ${
                    isActive
                      ? "text-blue-500"
                      : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <Icon />
                  <p className="hidden tablet:inline text-[12px]">{label}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MobileMenuBar;
