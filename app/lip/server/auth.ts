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


// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("token");

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token.value, secret);

//     if (payload.role !== "ADMIN") {
//       return NextResponse.redirect(new URL("/403", req.url));
//     }

//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }
