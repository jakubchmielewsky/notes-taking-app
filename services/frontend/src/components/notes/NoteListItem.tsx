import { useNavigate, useParams } from "react-router-dom";
import type { Notes } from "@notes/shared-types";

type NoteItem = Notes[number];

interface Props {
  note: NoteItem;
  route: string;
}

const NoteListItem: React.FC<Props> = ({ note, route }) => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <button
      onClick={() => navigate(`${route}/note/${note.id}`)}
      className={`w-full flex flex-col gap-150 px-100 py-[10px] items-start rounded-6 text-[12px] my-[2px] ${
        params.noteId === note.id
          ? "bg-neutral-100 dark:bg-neutral-800"
          : ""
      }`}
    >
      <h3 className="text-[16px] font-semibold text-neutral-950 dark:text-white">
        {note.title}
      </h3>
      <ul className="flex flex-wrap gap-050">
        {note.tags.map((tag) => (
          <li
            key={tag}
            className={`bg-neutral-200 py-025 px-100 rounded-4 dark:bg-neutral-700 ${
              params.noteId === note.id ? "dark:bg-neutral-400" : ""
            }`}
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="text-neutral-500 dark:text-neutral-300">
        {new Date(note.updatedAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </button>
  );
};

export default NoteListItem;
