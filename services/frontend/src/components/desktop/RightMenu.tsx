import ArchiveIcon from "@/assets/icons/icon-archive.svg?react";
import DeleteIcon from "@/assets/icons/icon-delete.svg?react";
import RestoreIcon from "@/assets/icons/icon-restore.svg?react";

interface Props {
  archive?: () => void;
  restore?: () => void;
  remove: () => void;
}

const RightMenu: React.FC<Props> = ({ archive, restore, remove }) => {
  const btnClass =
    "w-full flex items-center px-150 py-200 gap-100 border border-neutral-300 rounded-8 dark:border-neutral-600 hover:border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:border-neutral-950 dark:focus:border-white focus:outline outline-offset-2 outline-2 outline-neutral-400";

  return (
    <div className="h-full w-full flex flex-col py-250 pl-200 gap-150 text-[14px] text-neutral-950 border-l border-neutral-200 dark:border-neutral-800 dark:text-white">
      {archive && (
        <button onClick={archive} className={btnClass}>
          <ArchiveIcon className="w-250 h-250" />
          Archive Note
        </button>
      )}
      {restore && (
        <button onClick={restore} className={btnClass}>
          <RestoreIcon className="w-250 h-250" />
          Restore Note
        </button>
      )}
      <button onClick={remove} className={btnClass}>
        <DeleteIcon className="w-250 h-250" />
        Delete Note
      </button>
    </div>
  );
};

export default RightMenu;
