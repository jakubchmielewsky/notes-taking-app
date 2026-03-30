import SearchIcon from "@/assets/icons/icon-search.svg?react";
import SettingsIcon from "@/assets/icons/icon-settings.svg?react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const DesktopHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchValue, setSearchValue] = useState("");

  const getTitle = () => {
    if (location.pathname.includes("/home")) return "All Notes";
    if (location.pathname.includes("/archived")) return "Archived";
    if (location.pathname.includes("/tag"))
      return `Tagged: ${params.tagName}`;
    if (location.pathname.includes("/search"))
      return searchValue ? `Results for: ${searchValue}` : "Search";
    if (location.pathname.includes("/settings")) return "Settings";
    return "Notes";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="hidden desktop:flex w-full px-400 border-b border-neutral-200 justify-between items-center min-h-[81px] dark:border-neutral-800">
      <h2 className="text-[24px] font-semibold text-neutral-950 dark:text-white">
        {getTitle()}
      </h2>
      <div className="flex gap-200 items-center text-neutral-500 dark:text-neutral-400">
        <div className="border border-neutral-300 px-200 py-150 flex rounded-8 w-[300px] gap-075 dark:border-neutral-500">
          <label htmlFor="desktop-search">
            <SearchIcon className="w-[20px] h-[20px]" />
          </label>
          <input
            id="desktop-search"
            type="text"
            placeholder="Search by title, content, or tags…"
            value={searchValue}
            onChange={handleSearch}
            className="text-[14px] w-full border-none outline-none shadow-none bg-transparent"
          />
        </div>
        <Link to="/settings">
          <SettingsIcon />
        </Link>
      </div>
    </div>
  );
};

export default DesktopHeader;
