import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {apiPost} from "@/lib/api";
import GoogleProvider from "next-auth/providers/google";

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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if (account?.provider === "google") {
                try {
                    // 关键：将 Google 用户信息同步到你的 Laravel 数据库
                    const response = await apiPost(`/auth/google`, {
                        email: user.email,
                        name: user.name,
                        google_id: user.id,
                        image: user.image,
                    });

                    user = {...user, accessToken: response.data.access_token};
                    console.log('user:', user);
                    return true; // 如果 Laravel 报错，拒绝登录
                } catch (error) {
                    console.error("同步到 Laravel 失败", error);
                    return false;
                }
            }
            return true;
        },
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
