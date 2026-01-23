import { DateTime } from "luxon";
import { NoteData } from "../lip/client/types";
import { useNotesDispatch, useNotesState } from "../contexts/notes-context";

export default function Note({ note }: { note: NoteData }){
    const state = useNotesState();
    const dispatch = useNotesDispatch();

    function handleDragStart(e: React.DragEvent) {
        console.log("Drag Start.. ");
        dispatch({
            type: "update_current_drag_id",
            payload: note.id
        });
    }

    function handleDragLeave(e: React.DragEvent) {
        console.log("Leave.. ");
    }

    function handleDragEnter(e: React.DragEvent) {
        console.log("Enter.. ");
    }

    function handleDragOver(e: React.DragEvent) {
        console.log("Over.. ");
        e.preventDefault();
    }

    function handleDragDrop(e: React.DragEvent) {
        console.log("Drop.. ", note.id);
        console.log("Current drag ID >> ", state.currentDragId);
    }

    function handleDragEnd(e: React.DragEvent) {
        console.log("Drag End..");
    }

    return (
        <div 
            className="p-2 text-black bg-yellow-300 border-2 border-yellow-300 hover:border-blue-700 cursor-pointer"
            draggable
            onDragStart={handleDragStart}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDrop={handleDragDrop}
            onDragEnd={handleDragEnd}
        >
            <div>{note.title}</div>
            <div>{note.id}</div>
            <div>{note.created_at.toLocaleString(DateTime.DATETIME_SHORT)}</div>
            <div>{note.updated_at.toLocaleString(DateTime.DATETIME_SHORT)}</div>
            <div>{note.is_published ? "published" : "draft"}</div>
        </div>
    );
} 