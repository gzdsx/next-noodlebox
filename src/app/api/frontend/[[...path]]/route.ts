import {auth} from "@/auth";
import {NextRequest, NextResponse} from 'next/server';
import {headers as getHeaders} from "next/headers";

// 定义真实的后端基础地址
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.noodlebox.ie/api';

async function handleProxy(request: NextRequest, {params}: { params: { path?: string[] } }) {
    // 1. 拼接目标 URL
    // 将前端请求的 /api/foo/bar 转换为后端地址的 /foo/bar
    const requestParams = await params;
    const path = requestParams.path?.join('/') || '';
    const queryString = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${path}${queryString}`;

    console.log('tagetUrl', targetUrl);
    const session = await auth();
    const token = (session as any)?.accessToken;
    const headerStore = await getHeaders();
    const realIp = headerStore.get('x-forwarded-for')?.split(',')[0] || '';
    // 复制原始请求中必要的 Header
    const headers = new Headers();
    const whiteList = ['accept', 'user-agent', 'content-type'];
    request.headers.forEach((value, key) => {
        if (whiteList.includes(key.toLowerCase())) {
            headers.set(key, value);
        }
    });

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('X-Real-IP', realIp);
    headers.set('X-Forwarded-For', realIp);

    // 4. 处理 Body (核心修复点)
    let body: BodyInit | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        // 使用 blob() 之前确保流没有被占用
        body = await request.blob();
    }

    // return fetch(targetUrl, {
    //     method: request.method,
    //     cache: 'no-store',
    //     headers,
    //     body
    // });

    // 2. 准备转发的 Request 选项
    const requestOptions: RequestInit = {
        method: request.method,
        // 只有非 GET/HEAD 请求才转发 body
        body: body,
        // 强制不缓存，确保每次请求都到达后端
        cache: 'no-store',
        headers
    };

    try {
        const backendResponse = await fetch(targetUrl, requestOptions);
        console.log('backendResponse', backendResponse);
        // 4. 将后端的响应（包括状态码、Header、Body）原样返回给前端
        const responseHeaders = new Headers(backendResponse.headers);
        // 【关键步骤】移除导致解析错误的 Header
        // 因为 fetch 已经帮你解压了，所以必须删掉这两个字段
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('transfer-encoding');

        return new NextResponse(backendResponse.body, {
            headers: responseHeaders,
            status: backendResponse.status,
            statusText: backendResponse.statusText
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({message: '无法连接到远程服务器'}, {status: 502});
    }
}

// 导出所有支持的 HTTP 方法
// 明确导出每一个方法，确保类型匹配
export async function GET(request: NextRequest, context: any) {
    return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: any) {
    return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: any) {
    return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: any) {
    return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: any) {
    return handleProxy(request, context);
}