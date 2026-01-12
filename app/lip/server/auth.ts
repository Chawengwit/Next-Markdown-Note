import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { sql } from "./db";

import config from "./config";

export default async function getJWTPayload() {
    const cookieStore = cookies();
    const token  = (await cookieStore).get("jwt-token");
    const secret = new TextEncoder().encode(config.JWT_SECRET);

    const { payload, protectedHeader } = await jwtVerify(token?.value!, secret);
    
    return payload;
}

export async function getCurrentUser(){
    const payload = await getJWTPayload();
    const userRes = await sql("SELECT * FROM users WHERE id = $1", [payload.sub]);
    return userRes.rows[0];
}
