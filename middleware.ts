import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function middleware(request: NextRequest){
    const pathname = request.nextUrl.pathname;

    const authenticatedRoutes = [pathname.startsWith("/dashboard")];
    const authenticatedAPIRoutes = [pathname.startsWith("/api/notes")];

    if(authenticatedRoutes.includes(true)){
        const token = request.cookies.get("jwt-token");

        if(!token || !token?.value){
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token.value, secret);

            // TODO next check role >> ADMIN 
            // if(payload.role !== "ADMIN"){
            //     return NextResponse.redirect(new URL("/403", request.url));
            // }s
            
            return NextResponse.next();

        } catch (error){
            console.log(error);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if(authenticatedAPIRoutes.includes(true)) {
        const cookies = request.cookies.get("jwt-token");

        if(!cookies || !cookies.value){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jwtVerify(cookies.value, secret);
            return NextResponse.next();
        } catch (error){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }
    
}