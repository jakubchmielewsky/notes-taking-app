import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useNoteDetails,
  useArchivedNotes,
  useNotes,
  useUpdateNote,
  useArchiveNote,
  useRestoreNote,
  useDeleteNote,
} from "@/hooks/useNotes";
import RightMenu from "@/components/desktop/RightMenu";
import MobileHeaderControls from "@/components/mobile/MobileHeaderControls";
import Modal from "@/components/ui/Modal";
import DeleteIcon from "@/assets/icons/icon-delete.svg?react";
import ArchiveIcon from "@/assets/icons/icon-archive.svg?react";
import TagIcon from "@/assets/icons/icon-tag.svg?react";
import ClockIcon from "@/assets/icons/icon-clock.svg?react";
import { useNotificationsStore } from "@/stores/notificationsStore";

interface ModalState {
  open: boolean;
  icon: React.FC<React.SVGProps<SVGSVGElement>> | null;
  title: string;
  description: string;
  variant: "danger" | "primary";
  onSubmit: () => void;
}

const closedModal: ModalState = {
  open: false,
  icon: null,
  title: "",
  description: "",
  variant: "danger",
  onSubmit: () => {},
};

const NotePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { data: notesData = [] } = useNotes();
  const { data: archivedData = [] } = useArchivedNotes();
  const { addNotification } = useNotificationsStore();

  const allNotes = [...notesData, ...archivedData];
  const note = allNotes.find((n) => n.id === noteId) ?? null;

  const updateNote = useUpdateNote(noteId!);
  const archiveNote = useArchiveNote();
  const restoreNote = useRestoreNote();
  const deleteNote = useDeleteNote();

  const { data: details } = useNoteDetails(noteId!);

  const [inputs, setInputs] = useState({ title: "", tags: "", content: "" });
  const [modal, setModal] = useState<ModalState>(closedModal);

  useEffect(() => {
    if (details) {
      setInputs({
        title: details.title,
        tags: details.tags.join(", "),
        content: details.content,
      });
    }
  }, [details]);

  if (!note) return <Navigate to="/home" />;

  const notify = (message: string) =>
    addNotification({ id: crypto.randomUUID(), message, type: "success" });

  const isArchived = !notesData.find((n) => n.id === noteId);

  const handleSave = () => {
    updateNote.mutate(
      {
        title: inputs.title,
        content: inputs.content,
        tags: inputs.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      },
      { onSuccess: () => notify("Note successfully saved.") }
    );
  };

  const handleCancel = () => {
    if (details) {
      setInputs({
        title: details.title,
        tags: details.tags.join(", "),
        content: details.content,
      });
    }
  };

  const handleArchive = () =>
    setModal({
      open: true,
      icon: ArchiveIcon,
      title: "Archive Note",
      description:
        "Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.",
      variant: "primary",
      onSubmit: () => {
        archiveNote.mutate(noteId!, {
          onSuccess: () => {
            navigate(-1);
            notify("Note archived.");
          },
        });
      },
    });

  const handleRestore = () => {
    restoreNote.mutate(noteId!, {
      onSuccess: () => {
        navigate(-1);
        notify("Note restored.");
      },
    });
  };

  const handleDelete = () =>
    setModal({
      open: true,
      icon: DeleteIcon,
      title: "Delete Note",
      description:
        "Are you sure you want to permanently delete this note? This action cannot be undone.",
      variant: "danger",
      onSubmit: () => {
        deleteNote.mutate(noteId!, {
          onSuccess: () => {
            navigate(-1);
            notify("Note deleted.");
          },
        });
      },
    });

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="grow flex flex-col px-200 py-250 gap-150 overflow-y-auto">
        {/* Mobile: top action bar */}
        <div className="desktop:hidden">
          {isArchived ? (
            <MobileHeaderControls
              goBack={() => navigate(-1)}
              restore={handleRestore}
              remove={handleDelete}
              cancel={handleCancel}
              save={handleSave}
            />
          ) : (
            <MobileHeaderControls
              goBack={() => navigate(-1)}
              archive={handleArchive}
              remove={handleDelete}
              cancel={handleCancel}
              save={handleSave}
            />
          )}
        </div>

        <div className="grow flex flex-col gap-150 text-neutral-950 dark:text-white">
          <input
            type="text"
            className="text-[24px] font-bold bg-transparent outline-none placeholder-neutral-950 dark:placeholder-white"
            placeholder="Enter a Title..."
            value={inputs.title}
            onChange={(e) => setInputs({ ...inputs, title: e.currentTarget.value })}
          />
          <div className="grid grid-cols-2 text-[12px]">
            <label className="flex gap-075 items-center py-050 text-neutral-600 dark:text-neutral-400">
              <TagIcon className="h-200 w-200" /> Tags
            </label>
            <input
              className="flex items-center py-050 bg-transparent outline-none text-neutral-500 dark:text-neutral-300"
              type="text"
              placeholder="Enter tags separated by commas"
              value={inputs.tags}
              onChange={(e) => setInputs({ ...inputs, tags: e.currentTarget.value })}
            />
            <label className="flex gap-075 items-center py-050 text-neutral-600 dark:text-neutral-400">
              <ClockIcon className="h-200 w-200" /> Last edited
            </label>
            <p className="flex items-center py-050 text-neutral-500 dark:text-neutral-300">
              {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800" />
          <div className="grow">
            <textarea
              className="h-full w-full bg-transparent outline-none resize-none text-[14px]"
              placeholder="Start typing your note here…"
              value={inputs.content}
              onChange={(e) => setInputs({ ...inputs, content: e.currentTarget.value })}
            />
          </div>

          {/* Desktop: bottom save/cancel buttons */}
          <div className="hidden desktop:block">
            <div className="border-t border-neutral-200 dark:border-neutral-800 mb-150" />
            <div className="flex gap-200 items-center">
              <button
                className="bg-blue-500 px-200 py-150 rounded-8 text-[14px] text-white hover:bg-blue-700 focus:outline outline-offset-2 outline-2 outline-neutral-400"
                onClick={handleSave}
                disabled={updateNote.isPending}
              >
                Save Note
              </button>
              <button
                className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-200 py-150 rounded-8 text-[14px] hover:bg-transparent border border-transparent hover:border-neutral-300 focus:outline outline-offset-2 outline-2 outline-neutral-400"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: right action menu */}
      <div className="hidden desktop:block w-[258px] mr-400">
        {isArchived ? (
          <RightMenu restore={handleRestore} remove={handleDelete} />
        ) : (
          <RightMenu archive={handleArchive} remove={handleDelete} />
        )}
      </div>

      {modal.open && (
        <Modal
          icon={modal.icon}
          title={modal.title}
          description={modal.description}
          variant={modal.variant}
          onSubmit={modal.onSubmit}
          onClose={() => setModal(closedModal)}
        />
      )}
    </div>
  );
};

export default NotePage;
