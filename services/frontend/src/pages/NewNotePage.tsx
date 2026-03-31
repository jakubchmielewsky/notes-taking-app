import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreateNote } from "@/hooks/useNotes";
import MobileHeaderControls from "@/components/mobile/MobileHeaderControls";
import TagIcon from "@/assets/icons/icon-tag.svg?react";
import ClockIcon from "@/assets/icons/icon-clock.svg?react";
import { useNotificationsStore } from "@/stores/notificationsStore";

const NewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const createNote = useCreateNote();
  const { addNotification } = useNotificationsStore();
  const [inputs, setInputs] = useState({ title: "", tags: "", content: "" });

  const handleSave = () => {
    createNote.mutate(
      {
        title: inputs.title,
        content: inputs.content,
        tags: inputs.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      },
      {
        onSuccess: () => {
          navigate("/home");
          addNotification({ message: "Note successfully added.", type: "success" });
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full px-200 py-250 gap-150 desktop:mr-[290px] desktop:border-r desktop:border-neutral-200 dark:desktop:border-neutral-800 overflow-y-auto">
      {/* Mobile: top action bar */}
      <div className="desktop:hidden">
        <MobileHeaderControls
          goBack={() => navigate(-1)}
          cancel={() => navigate(-1)}
          save={handleSave}
        />
      </div>

      <div className="grow flex flex-col gap-150 text-neutral-950 dark:text-white">
        <input
          type="text"
          className="text-[24px] font-bold bg-transparent outline-none placeholder-neutral-950 dark:placeholder-white"
          placeholder="Enter a Title..."
          value={inputs.title}
          onChange={(e) =>
            setInputs({ ...inputs, title: e.currentTarget.value })
          }
        />
        <div className="grid grid-cols-2 text-[12px]">
          <label className="flex gap-075 items-center py-050 text-neutral-600 dark:text-neutral-400">
            <TagIcon className="h-200 w-200" /> Tags
          </label>
          <input
            className="flex items-center py-050 bg-transparent outline-none text-neutral-500 dark:text-neutral-300"
            type="text"
            placeholder="Add tags separated by commas"
            value={inputs.tags}
            onChange={(e) =>
              setInputs({ ...inputs, tags: e.currentTarget.value })
            }
          />
          <label className="flex gap-075 items-center py-050 text-neutral-600 dark:text-neutral-400">
            <ClockIcon className="h-200 w-200" /> Last edited
          </label>
          <p className="flex items-center py-050 text-neutral-400">
            Not yet saved
          </p>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-800" />
        <div className="grow">
          <textarea
            className="h-full w-full bg-transparent outline-none resize-none text-[14px]"
            placeholder="Start typing your note here…"
            value={inputs.content}
            onChange={(e) =>
              setInputs({ ...inputs, content: e.currentTarget.value })
            }
          />
        </div>

        {/* Desktop: bottom save/cancel buttons */}
        <div className="hidden desktop:block">
          <div className="border-t border-neutral-200 dark:border-neutral-800 mb-150" />
          <div className="flex gap-200 items-center">
            <button
              className="bg-blue-500 px-200 py-150 rounded-8 text-[14px] text-white hover:bg-blue-700 focus:outline outline-offset-2 outline-2 outline-neutral-400"
              onClick={handleSave}
              disabled={createNote.isPending}
            >
              Save Note
            </button>
            <button
              className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-200 py-150 rounded-8 text-[14px] hover:bg-transparent border border-transparent hover:border-neutral-300 focus:outline outline-offset-2 outline-2 outline-neutral-400"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNotePage;
