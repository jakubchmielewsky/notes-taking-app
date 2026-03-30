import { Outlet, useNavigate, useParams } from "react-router-dom";
import SunIcon from "@/assets/icons/icon-sun.svg?react";
import FontIcon from "@/assets/icons/icon-font.svg?react";
import LogoutIcon from "@/assets/icons/icon-logout.svg?react";
import ChevronRightIcon from "@/assets/icons/icon-chevron-right.svg?react";
import MenuItem from "@/components/desktop/MenuItem";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/api/endpoints";

const SettingsPage: React.FC = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { setting } = useParams();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore server errors — log out locally regardless
    }
    logout();
    navigate("/login");
  };

  const items = [
    { Icon: SunIcon, name: "Color Theme", route: "/settings/theme", setting: "theme" },
    { Icon: FontIcon, name: "Font Theme", route: "/settings/font", setting: "font" },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Settings list panel */}
      <div
        className={`relative h-full flex flex-col px-200 pt-250 gap-200 border-r border-neutral-200 dark:border-neutral-800 shrink-0 desktop:w-[290px] dark:bg-neutral-950 dark:text-white ${
          setting ? "hidden desktop:flex" : "flex w-full"
        }`}
      >
        {/* Desktop: MenuItem style list */}
        <ul className="hidden desktop:flex h-full w-full flex-col gap-100 text-neutral-950 dark:text-neutral-200">
          {items.map((item) => (
            <li key={item.setting}>
              <MenuItem
                name={item.name}
                active={item.setting === setting}
                onClick={() => navigate(item.route)}
                Icon={item.Icon}
              />
            </li>
          ))}
          <div className="border-t border-neutral-200 dark:border-neutral-800" />
          <MenuItem
            name="Logout"
            active={false}
            onClick={handleLogout}
            Icon={LogoutIcon}
          />
        </ul>

        {/* Mobile: chevron-style list */}
        <div className="desktop:hidden">
          <h2 className="text-[20px] font-semibold text-neutral-950 dark:text-white mb-200">
            Settings
          </h2>
          <ul className="flex flex-col gap-100">
            {items.map(({ Icon, name, route }) => (
              <li key={route}>
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center justify-between w-full px-150 py-[10px] text-[14px] rounded-8 text-neutral-950 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <div className="flex items-center gap-100">
                    <Icon className="w-[20px] h-[20px]" />
                    {name}
                  </div>
                  <ChevronRightIcon className="w-[20px] h-[20px]" />
                </button>
              </li>
            ))}
            <div className="border-t border-neutral-200 dark:border-neutral-800 my-100" />
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-100 w-full px-150 py-[10px] text-[14px] rounded-8 text-neutral-950 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <LogoutIcon className="w-[20px] h-[20px]" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Setting detail outlet */}
      <div
        className={`${
          setting ? "flex grow overflow-y-auto" : "hidden desktop:flex desktop:grow"
        }`}
      >
        <Outlet />
      </div>

      {/* Desktop: right spacer to center content */}
      <div className="hidden desktop:block w-[290px]" />
    </div>
  );
};

export default SettingsPage;
