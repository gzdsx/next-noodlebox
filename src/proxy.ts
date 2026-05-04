import {auth} from "@/auth"
import {NextResponse} from "next/server"

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
}

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const {nextUrl} = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/user");
    if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        const redirect = nextUrl.searchParams.get("redirect") || "/user";
        return NextResponse.redirect(new URL(redirect, nextUrl));
    }

    // 1. 如果没登录且试图访问受限页面
    if (!isLoggedIn && isAuthRoute && !nextUrl.pathname.startsWith("/login")) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("redirect", nextUrl.href);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/user/:path*"],
}
