import LogoIcon from "@/assets/icons/logo.svg?react";

const MobileHeader: React.FC = () => {
  return (
    <div className="desktop:hidden w-full px-200 py-150 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
      <LogoIcon className="dark:text-white" />
    </div>
  );
};

export default MobileHeader;
