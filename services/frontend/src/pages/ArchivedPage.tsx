import { Outlet, useNavigate, useParams } from "react-router-dom";
import NotesList from "@/components/notes/NotesList";
import PlusIcon from "@/assets/icons/icon-plus.svg?react";
import { useArchivedNotes } from "@/hooks/useNotes";

const ArchivedPage: React.FC = () => {
  const { data: notes = [] } = useArchivedNotes();
  const navigate = useNavigate();
  const { noteId } = useParams();

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div
        className={`relative h-full flex flex-col px-200 pt-250 gap-200 border-r border-neutral-200 dark:border-neutral-800 shrink-0 desktop:w-[290px] ${
          noteId ? "hidden desktop:flex" : "flex w-full"
        }`}
      >
        <button
          onClick={() => navigate("/newnote")}
          className="hidden desktop:flex justify-center items-center gap-050 w-full bg-blue-500 px-200 py-150 rounded-8 text-[14px] text-white hover:bg-blue-700 focus:outline outline-offset-2 outline-2 outline-neutral-400"
        >
          <PlusIcon className="h-250 w-250" />
          Create New Note
        </button>
        <NotesList notes={notes} route="/archived" />
        <button
          onClick={() => navigate("/newnote")}
          className="desktop:hidden fixed bottom-[90px] right-200 w-[56px] h-[56px] bg-blue-500 rounded-full flex justify-center items-center shadow-lg hover:bg-blue-700"
        >
          <PlusIcon className="text-white" />
        </button>
      </div>
      <div
        className={`overflow-y-auto ${
          noteId ? "flex grow" : "hidden desktop:flex desktop:grow"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ArchivedPage;
