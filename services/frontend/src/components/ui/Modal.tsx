interface ModalProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>> | null;
  title: string;
  description: string;
  variant: "danger" | "primary";
  onSubmit: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  icon: Icon,
  title,
  description,
  variant,
  onSubmit,
  onClose,
}) => {
  const submitBg =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-500/90"
      : "bg-blue-500 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-w-[440px] w-full bg-neutral-0 rounded-12 border border-neutral-200 divide-y divide-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 dark:divide-neutral-600"
      >
        {/* header */}
        <div className="flex px-200 py-200 gap-150">
          <div className="bg-neutral-100 min-w-[40px] h-[40px] rounded-8 flex justify-center items-center dark:bg-neutral-600">
            {Icon && <Icon className="w-[24px] h-[24px] dark:text-white" />}
          </div>
          <div className="flex flex-col gap-075">
            <h4 id="modal-title" className="text-[16px] font-bold text-neutral-950 dark:text-white">
              {title}
            </h4>
            <p className="text-[14px] text-neutral-950 dark:text-neutral-200">
              {description}
            </p>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-150 px-200 py-150 justify-end">
          <button
            className="bg-neutral-100 dark:bg-neutral-500 text-neutral-600 dark:text-neutral-200 px-200 py-150 rounded-8 text-[14px] hover:bg-transparent border border-transparent hover:border-neutral-300 focus:outline outline-offset-2 outline-2 outline-neutral-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-200 py-150 rounded-8 text-[14px] text-white focus:outline outline-offset-2 outline-2 outline-neutral-400 ${submitBg}`}
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            {title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
