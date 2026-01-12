import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest){
    const pathname = request.nextUrl.pathname;

    const authenticatedRoutes = [pathname.startsWith("/dashboard")];

    if(authenticatedRoutes.includes(true)){
        const token = request.cookies.get("jwt-token");

        if(!token || !token?.value){
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            
            return NextResponse.redirect(url);
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token.value, secret);
            return NextResponse.next();

        } catch (error){
            console.log(error);
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            
            return NextResponse.redirect(url);
        }
    }
}