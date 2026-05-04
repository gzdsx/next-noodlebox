import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {apiPost} from "@/lib/api";

export const {handlers, auth} = NextAuth({
    trustHost: true,
    providers: [
        CredentialsProvider({
            id: "sanctum",
            name: "Laravel Backend",
            credentials: {
                account: {label: "Account", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                // 调用你的 Laravel 接口
                try {
                    const res = await apiPost("/auth/login", credentials);
                    // 验证成功后，返回的对象会被存入 JWT
                    if (res.data.access_token && res.data.user) {
                        return {...res.data.user, accessToken: res.data.access_token};
                    }
                    return null;
                } catch (e) {
                    console.log('e:', e);
                    throw e;
                }
            }
        })
    ],
    callbacks: {
        // 1. 将 Token 和 User 信息存入 JWT 中
        async jwt({token, user}) {
            return {...token, ...user}
        },
        // 2. 将 JWT 中的信息暴露给前端 session
        async session({session, token}) {
            (session as any).accessToken = token.accessToken as string;
            (session as any).user.id = token.id;
            (session as any).user.name = token.name;
            (session as any).user.avatar = token.avatar as string;
            (session as any).user.role = token.role as string;
            (session as any).user.points = token.points as string;

            return session;
        }
    },
    session: {
        strategy: "jwt", // 使用 JWT 策略
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
});
