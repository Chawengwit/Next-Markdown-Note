import { DateTime } from "luxon";
import { NoteData } from "../lip/client/types";

export default function Note({ note }: { note: NoteData }){
    

    function handleDragStart(e: React.DragEvent) {
        console.log("Drag Start.. ");
    }

    function handleDragLeave(e: React.DragEvent) {
        console.log("Leave.. ");
    }

    function handleDragEnter(e: React.DragEvent) {
        console.log("Enter.. ");
    }

    function handleDragOver(e: React.DragEvent) {
        console.log("Over.. ");
    }

    function handleDragDrop(e: React.DragEvent) {
        console.log("Drop.. ");
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