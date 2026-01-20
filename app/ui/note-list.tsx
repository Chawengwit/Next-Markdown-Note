import { NoteData } from "../lip/client/types";
import Note from "./note";

export default function NoteList({ notes }: { notes: NoteData[] }) {
    if (notes.length === 0) {
        return <div className="p-4 text-center text-gray-500">No notes found</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {notes.map((note) => (
                <Note key={note.id} note={note} />
            ))}
        </div>
    );
}