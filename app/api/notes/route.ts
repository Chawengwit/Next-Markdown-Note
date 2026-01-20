import { getCurrentUser } from "@/app/lip/server/auth";
import { sql } from "@/app/lip/server/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const parent_note_id = searchParams.get("parent_note_id");
    const user = await getCurrentUser();

    let notesRes = null;
    if(parent_note_id){
        notesRes = await sql("SELECT * FROM notes WHERE user_id = $1 and parent_note_id = $2 ORDER BY title ASC;", [user.id, parent_note_id]);
    }else {
        notesRes = await sql("SELECT * FROM notes WHERE user_id = $1 and parent_note_id IS NULL;", [user.id]);
    }

    const ids = notesRes.rows.map((row) => row.id);
    const child_notes_count = await sql(
        "SELECT parent_note_id, count(*)::int FROM notes WHERE parent_note_id = any($1) GROUP BY parent_note_id;", [ids]
    );

    console.log("child_notes_count >> ", child_notes_count);

    const childNotesCountMap = child_notes_count.rows.reduce((map: any, row: any) => {
        map[row.parent_note_id] = row.count;
        return map;
    }, {});

    console.log("childNotesCountMap >> ",childNotesCountMap);
    
    notesRes.rows.forEach((row) => {
        if(childNotesCountMap.hasOwnProperty(row.id)) {
            row.child_count = childNotesCountMap[row.id];
        }else {
            row.child_count = 0;
        }
    });

    return NextResponse.json(notesRes.rows);

}

export async function POST(request: Request){
    const user = await getCurrentUser();
    const noteRes = await sql(
        "INSERT INTO notes (title, content, user_id) VALUES ('Untitled Note', 'Content of the note', $1) RETURNING *;",
        [user.id]
    );

    return NextResponse.json(noteRes.rows[0]);
    
}