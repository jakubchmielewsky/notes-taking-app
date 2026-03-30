import type { Notes } from "@notes/shared-types";
import NoteListItem from "./NoteListItem";

interface Props {
  notes: Notes;
  route: string;
}

const NotesList: React.FC<Props> = ({ notes, route }) => {
  return (
    <ul
      className="h-full divide-y divide-neutral-100 dark:divide-neutral-800
        overflow-y-auto
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-neutral-200
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-800"
    >
      {notes.map((note) => (
        <li key={note.id}>
          <NoteListItem note={note} route={route} />
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
