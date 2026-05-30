import {NextRequest, NextResponse} from 'next/server';
import {headers as getHeaders} from "next/headers";
import {auth} from "@/auth";

// 定义真实的后端基础地址
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.noodlebox.ie/api';

async function handleProxy(request: NextRequest, {params}: { params: { path?: string[] } }) {
    // 1. 拼接目标 URL
    // 将前端请求的 /api/foo/bar 转换为后端地址的 /foo/bar
    const requestParams = await params;
    const path = requestParams.path?.join('/') || '';
    const queryString = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/${path}${queryString}`;

    //console.log('tagetUrl', targetUrl);
    const session = await auth();
    const token = (session as any)?.accessToken;
    const headerStore = await getHeaders();
    const realIp = headerStore.get('x-forwarded-for')?.split(',')[0] || '';
    // 复制原始请求中必要的 Header
    const headers = new Headers();
    headers.set('X-Real-IP', realIp);
    headers.set('X-Forwarded-For', realIp);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    // 2. 准备转发的 Request 选项
    const requestOptions: RequestInit = {
        method: request.method,
        // 强制不缓存，确保每次请求都到达后端
        cache: 'no-store',
        headers
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
        // 获取原始 Body 字节流
        (requestOptions as any).body = await request.body;
        (requestOptions as any).duplex = 'half';
    }

    //console.log('requestOptions:', requestOptions);

    try {
        const backendResponse = await fetch(targetUrl, requestOptions);
        // 4. 将后端的响应（包括状态码、Header、Body）原样返回给前端
        const responseHeaders = new Headers(backendResponse.headers);
        // 【关键步骤】移除导致解析错误的 Header
        // 因为 fetch 已经帮你解压了，所以必须删掉这两个字段
        responseHeaders.delete('content-length');
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('transfer-encoding');

        const arrayBuffer = await backendResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new NextResponse(buffer, {
            headers: responseHeaders,
            status: backendResponse.status,
            statusText: backendResponse.statusText
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({message: (error as Error).message}, {status: 502});
    }
}

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
