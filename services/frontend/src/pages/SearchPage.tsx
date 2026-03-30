import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import NotesList from "@/components/notes/NotesList";
import PlusIcon from "@/assets/icons/icon-plus.svg?react";
import SearchIcon from "@/assets/icons/icon-search.svg?react";
import { useNotes, useArchivedNotes } from "@/hooks/useNotes";

const SearchPage: React.FC = () => {
  const { data: notes = [] } = useNotes();
  const { data: archived = [] } = useArchivedNotes();
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(() => {
    const allNotes = [...notes, ...archived];
    if (!query) return allNotes;
    const q = query.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [notes, archived, query]);

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div
        className={`relative h-full flex flex-col px-200 pt-250 gap-200 border-r border-neutral-200 dark:border-neutral-800 shrink-0 desktop:w-[290px] ${
          noteId ? "hidden desktop:flex" : "flex w-full"
        }`}
      >
        <div className="desktop:hidden border border-neutral-300 px-200 py-150 flex rounded-8 gap-075 dark:border-neutral-600">
          <label htmlFor="mobile-search">
            <SearchIcon className="w-[20px] h-[20px] text-neutral-500" />
          </label>
          <input
            id="mobile-search"
            type="text"
            placeholder="Search by title, content, or tags…"
            value={query}
            onChange={(e) => setSearchParams({ q: e.currentTarget.value })}
            className="text-[14px] w-full border-none outline-none bg-transparent dark:text-white"
          />
        </div>
        <button
          onClick={() => navigate("/newnote")}
          className="hidden desktop:flex justify-center items-center gap-050 w-full bg-blue-500 px-200 py-150 rounded-8 text-[14px] text-white hover:bg-blue-700 focus:outline outline-offset-2 outline-2 outline-neutral-400"
        >
          <PlusIcon className="h-250 w-250" />
          Create New Note
        </button>
        <NotesList notes={filtered} route="/search" />
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

export default SearchPage;
