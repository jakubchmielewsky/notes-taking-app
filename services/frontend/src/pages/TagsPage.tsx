import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import NotesList from "@/components/notes/NotesList";
import PlusIcon from "@/assets/icons/icon-plus.svg?react";
import TagIcon from "@/assets/icons/icon-tag.svg?react";
import ArrowLeftIcon from "@/assets/icons/icon-arrow-left.svg?react";
import { useNotes } from "@/hooks/useNotes";

const TagsPage: React.FC = () => {
  const { data: notes = [] } = useNotes();
  const navigate = useNavigate();
  const { tagName, noteId } = useParams();

  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [notes]);

  const filteredNotes = useMemo(
    () =>
      notes.filter((note) =>
        note.tags.some(
          (tag) => tag.toLowerCase() === (tagName ?? "").toLowerCase()
        )
      ),
    [notes, tagName]
  );

  // Mobile-only: tag browser (desktop sidebar handles tag navigation)
  if (!tagName) {
    return (
      <div className="desktop:hidden px-200 pt-250">
        <h2 className="text-[20px] font-semibold text-neutral-950 dark:text-white mb-200">
          Tags
        </h2>
        <ul className="flex flex-col gap-100">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                onClick={() => navigate(`/tag/${tag}`)}
                className="flex items-center gap-100 w-full px-150 py-100 rounded-8 text-[14px] text-neutral-950 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <TagIcon className="w-[20px] h-[20px] text-neutral-500" />
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
        <button
          onClick={() => navigate("/tag")}
          className="desktop:hidden flex items-center gap-050 text-[14px] text-neutral-600 dark:text-neutral-400"
        >
          <ArrowLeftIcon className="w-[18px] h-[18px]" />
          All Tags
        </button>
        <h3 className="desktop:hidden text-[16px] font-semibold text-neutral-950 dark:text-white">
          #{tagName}
        </h3>
        <NotesList notes={filteredNotes} route={`/tag/${tagName}`} />
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

export default TagsPage;
