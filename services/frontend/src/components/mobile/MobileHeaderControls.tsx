import ArrowLeftIcon from "@/assets/icons/icon-arrow-left.svg?react";
import DeleteIcon from "@/assets/icons/icon-delete.svg?react";
import ArchiveIcon from "@/assets/icons/icon-archive.svg?react";
import RestoreIcon from "@/assets/icons/icon-restore.svg?react";

interface Props {
  goBack: () => void;
  remove?: () => void;
  archive?: () => void;
  restore?: () => void;
  cancel?: () => void;
  save?: () => void;
}

const MobileHeaderControls: React.FC<Props> = ({
  goBack,
  remove,
  archive,
  restore,
  cancel,
  save,
}) => {
  return (
    <div className="w-full pb-150 flex justify-between text-[14px] text-neutral-600 border-b border-neutral-200 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-800">
      <button onClick={goBack} className="flex gap-050 items-center">
        <ArrowLeftIcon className="w-[18px] h-[18px]" />
        Go Back
      </button>
      <div className="flex items-center gap-200">
        {remove && (
          <button onClick={remove}>
            <DeleteIcon className="w-[18px] h-[18px]" />
          </button>
        )}
        {archive && (
          <button onClick={archive}>
            <ArchiveIcon className="w-[18px] h-[18px]" />
          </button>
        )}
        {restore && (
          <button onClick={restore}>
            <RestoreIcon className="w-[18px] h-[18px]" />
          </button>
        )}
        {cancel && <button onClick={cancel}>Cancel</button>}
        {save && (
          <button onClick={save} className="text-blue-500">
            Save Note
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileHeaderControls;
