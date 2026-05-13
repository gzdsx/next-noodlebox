import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {apiGet, apiPost} from "@/lib/api";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
//import {cookies} from "next/headers";
import Cookies from "js-cookie";

export const {handlers, auth} = NextAuth({
    trustHost: true,
    providers: [
        CredentialsProvider({
            id: "sanctum",
            name: "Laravel Sanctum",
            credentials: {
                account: {label: "Account", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                //调用 Laravel 接口
                try {
                    const res = await apiPost("/auth/login", credentials);
                    // 验证成功后，返回的对象会被存入 JWT
                    if (res.data.access_token && res.data.user) {
                        const {access_token, user} = res.data;
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.avatar,
                            role: user.role,
                            points: user.points,
                            accessToken: access_token
                        };
                    }
                    return res.data;
                } catch (e) {
                    return {
                        status: 422,
                        message: 'Login failed'
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
                        const {access_token, user} = res.data;
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.avatar,
                            role: user.role,
                            points: user.points,
                            accessToken: access_token
                        };
                    }

                    return res.data;
                } catch (e) {
                    return {
                        status: 422,
                        message: 'Login failed'
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

                    // 在 signIn 回调中修改 user 属性，只有部分属性会被保留传给 jwt 回调
                    (user as any).id = response.data.user.id; // 使用 Laravel 的 ID 覆盖 Google ID
                    (user as any).name = response.data.user.name;
                    (user as any).role = response.data.user.role;
                    (user as any).points = response.data.user.points;
                    (user as any).image = response.data.user.avatar;
                    (user as any).accessToken = response.data.access_token;
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
        async jwt({token, user, trigger}) {
            //console.log('jwt token:', token);
            //console.log('jwt user:', user);
            //Cookies.set('accessToken', token.accessToken as string);
            if (trigger === 'update') {
                try {
                    const response = await apiGet(`/auth/user`);
                    token.name = response.data.name;
                    token.image = response.data.avatar;
                    token.role = response.data.role;
                    token.points = response.data.points;
                } catch {

                }
            }
            return {...token, ...user}
        },
        // 2. 将 JWT 中的信息暴露给前端 session
        async session({session, token}) {
            (session as any).user.id = token.id as string;
            (session as any).user.name = token.name as string;
            (session as any).user.image = token.image as string;
            //(session as any).user.role = token.role as string;
            (session as any).user.points = token.points as string;
            (session as any).accessToken = token.accessToken as string;

            return session;
        }
    },
    events: {
        async signOut(message) {
            // 这里的 token 包含了你在 jwt 回调里存储的 access_token
            const token = "token" in message ? message.token : null;
            if (token?.accessToken) {
                try {
                    // 调用 Laravel 后端的注销接口
                    await apiPost(`/auth/logout`);
                    console.log("Laravel Token 已成功清除");
                } catch (error) {
                    console.error("清除后端 Token 失败:", error);
                }
            }
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
    secret: process.env.AUTH_SECRET,
});
