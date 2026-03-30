import ChevronRightIcon from "@/assets/icons/icon-chevron-right.svg?react";

interface Props {
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  active?: boolean;
}

const MenuItem: React.FC<Props> = ({ name, Icon, onClick, active = false }) => {
  return (
    <button
      className={`flex justify-between w-full px-150 py-[10px] text-[14px] rounded-8 text-neutral-950 dark:text-neutral-200 ${
        active ? "bg-neutral-100 dark:bg-neutral-700" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-100">
        <Icon
          className={`w-[20px] h-[20px] ${active ? "text-blue-500" : ""}`}
        />
        {name}
      </div>
      {active && (
        <ChevronRightIcon className="w-[20px] h-[20px] dark:text-neutral-200" />
      )}
    </button>
  );
};

export default MenuItem;
