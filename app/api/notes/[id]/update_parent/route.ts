import { getCurrentUser } from "@/app/lip/server/auth";
import { sql } from "@/app/lip/server/db";
import { NextResponse } from "next/server";

import { z } from "zod";

const UpdateParentSchema = z.object({
    parent_note_id: z.string().uuid()
});

export async function POST(
    request: Request, 
    { params }: {
        params: Promise<{ id: string }>
    }
){
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json();
    const validatedFields = UpdateParentSchema.safeParse(body);

    if(!validatedFields.success){
        return NextResponse.json({
            errors: validatedFields.error.flatten().fieldErrors,
            message: "update parent bad request."

        }, {status: 400});
    }

    const res = await sql("SELECT * FROM notes WHERE user_id = $1 and id IN ($2, $3)", 
        [user.id, id, validatedFields.data.parent_note_id]
    );

    if(res.rowCount != 2){
        return NextResponse.json({
            message: "unauthorized"
        });
    }

    await sql("UPDATE notes SET parent_note_id = $1 WHERE id = $2", 
        [validatedFields.data.parent_note_id, id]
    );

    return NextResponse.json({
        message: "update note parent success."
    });
};