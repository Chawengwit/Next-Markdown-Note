"use client";

import { useNotesDispatch, useNotesState } from "../contexts/notes-context";
import { useEffect } from "react";
import { fetchNotes } from "../lip/client/api";
import NoteList from "./note-list";

export default function NoteContainer(){
    const state = useNotesState();
    const dispatch = useNotesDispatch();

    useEffect(() => {
        async function init() {
            const notes = await fetchNotes();
            dispatch({
                type: "set_root_notes",
                payload: notes
            });
        }

        init();
    }, [dispatch]);

    if(!state.rootNotes) {
        return <div>loading..</div>;
    }

    return (
        <NoteList notes={state.rootNotes} />
    );
}