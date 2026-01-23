import { DateTime } from "luxon";
import { NoteData } from "./types";

export async function fetchNotes(parent_note_id?: string) {
    let queryString = "";
    if(parent_note_id) {
        queryString = `?parent_note_id=${parent_note_id}`;
    }

    const notesRes = await fetch("api/notes" + queryString, {
        cache: "no-store",
    });

    const json = await notesRes.json();
    const transformedJson = json.map((note: any) => {
        return transformJsonToNote(note);
    });

    return transformedJson;
}

export async function createNote() {
    const res = await fetch("/api/notes", {
        method: "POST",
    });

    const json = await res.json();
    return transformJsonToNote(json);
}

export async function updateParent(currentDragId: string, newParentDragId: string){
    await fetch("api/notes/" + currentDragId + "/update_parent", {
        method: "POST",
        body: JSON.stringify({
            parent_note_id: newParentDragId
        })
    });
}

function transformJsonToNote(note: any): NoteData {
    return {
        ...note,
        created_at: DateTime.fromISO(note.created_at),
        updated_at: DateTime.fromISO(note.updated_at),
        child_notes: [],
        child_count: 0      
    };
}