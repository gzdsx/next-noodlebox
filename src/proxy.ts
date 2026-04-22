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

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute = nextUrl.pathname.startsWith("/user");

    // 1. 如果没登录且试图访问受限页面
    if (!isLoggedIn && (isAdminRoute || isAuthRoute)) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && nextUrl.pathname === "/login") {
        const callbackUrl = nextUrl.searchParams.get("callbackUrl") || "/user";
        return NextResponse.redirect(new URL(callbackUrl, nextUrl));
    }

    // 2. 如果是司机试图进管理后台
    if (isAdminRoute && (req.auth?.user as unknown as User).role !== 'administrator') {
        return NextResponse.redirect(new URL("/user", nextUrl));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/admin/:path*", "/user/:path*"],
}
