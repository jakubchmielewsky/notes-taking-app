import LogoIcon from "@/assets/icons/logo.svg?react";
import HomeIcon from "@/assets/icons/icon-home.svg?react";
import ArchiveIcon from "@/assets/icons/icon-archive.svg?react";
import TagIcon from "@/assets/icons/icon-tag.svg?react";
import MenuItem from "./MenuItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";

const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { data: notes = [] } = useNotes();

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
    });
    return Object.keys(counts)
      .map((tag) => ({ tag, count: counts[tag] }))
      .sort((a, b) => b.count - a.count)
      .map(({ tag }) => tag);
  }, [notes]);

  return (
    <div className="hidden desktop:flex w-[272px] h-full py-150 px-200 border-r border-neutral-200 flex-col gap-100 dark:bg-neutral-950 dark:border-neutral-800">
      <div className="py-150 mb-200">
        <LogoIcon className="dark:text-white" />
      </div>

      <div className="flex flex-col gap-050">
        <MenuItem
          name="All Notes"
          Icon={HomeIcon}
          onClick={() => navigate("/home")}
          active={location.pathname.includes("/home")}
        />
        <MenuItem
          name="Archived Notes"
          Icon={ArchiveIcon}
          onClick={() => navigate("/archived")}
          active={location.pathname.includes("/archived")}
        />
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800" />
      <h3 className="px-100 text-[12px] text-neutral-500">Tags</h3>

      <ul
        className="flex flex-col gap-050 overflow-y-auto
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-neutral-200
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800"
      >
        {tags.map((tag) => (
          <li key={tag}>
            <MenuItem
              name={tag}
              Icon={TagIcon}
              onClick={() => navigate(`/tag/${tag}`)}
              active={params.tagName === tag}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopSidebar;
