import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest){
    const pathname = request.nextUrl.pathname;

    const authenticatedRoutes = [pathname.startsWith("/dashboard")];

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
            // }
            
            return NextResponse.next();

        } catch (error){
            console.log(error);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}