import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {apiPost} from "@/lib/api";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

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
                    return res.data;
                } catch (e) {
                    console.log('e:', e);
                    return {
                        status: e.status,
                        message: e.message
                    }
                }
            }
        }),
        CredentialsProvider({
            id: "sms",
            name: "Laravel SMS",
            credentials: {
                iddcode: {label: "IDDCode", type: "text", required: true},
                phone_number: {label: "Phone Number", type: "text", required: true},
                code: {label: "Verification Code", type: "text", required: true}
            },
            async authorize(credentials) {
                // 调用你的 Laravel 接口
                try {
                    const res = await apiPost("/auth/sms-login", credentials);
                    // 验证成功后，返回的对象会被存入 JWT
                    if (res.data.access_token && res.data.user) {
                        return {...res.data.user, accessToken: res.data.access_token};
                    }

                    return res.data;
                } catch (e) {
                    return {
                        status: e.status,
                        message: e.message
                    }
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({user, account}) {
            //console.log('user:', user);
            //console.log('account:', account);
            if (account?.provider === "sms" || account?.provider === "sanctum") {
                if (!user.accessToken) {
                    return false;
                }
            }
            if (account?.provider === "google") {
                try {
                    // 关键：将 Google 用户信息同步到你的 Laravel 数据库
                    const response = await apiPost(`/auth/google`, {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.image,
                    });
                    user = {...user, accessToken: response.data.access_token};
                    //console.log('google user:', user);
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
        signIn: '/auth/login',
        error: '/auth/login',
    },
    debug: true,
    secret: process.env.NEXTAUTH_SECRET,
});
