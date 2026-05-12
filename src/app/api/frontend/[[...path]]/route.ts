import {NextRequest, NextResponse} from 'next/server';
import {headers as getHeaders} from "next/headers";
import {cookies} from "next/headers";

// 定义真实的前端API基础地址
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_API_URL || 'https://www.noodlebox.ie/api';

async function handleProxy(request: NextRequest, {params}: { params: { path?: string[] } }) {
    // 1. 拼接目标 URL
    // 将前端请求的 /api/frontend/foo/bar 转换为前端API地址的 /foo/bar
    const requestParams = await params;
    const path = requestParams.path?.join('/') || '';
    const queryString = request.nextUrl.search;
    const targetUrl = `${FRONTEND_URL}/${path}${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const headerStore = await getHeaders();
    const realIp = headerStore.get('x-forwarded-for')?.split(',')[0] || '';

    // 复制原始请求中必要的 Header
    const headers = new Headers(request.headers);
    headers.set('X-Real-IP', realIp);
    headers.set('X-Forwarded-For', realIp);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const contentType = request.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    let body: any = undefined;
    if (!['GET', 'HEAD'].includes(request.method)) {
        body = await request.body;
    }

    // 2. 准备转发的 Request 选项
    const requestOptions: RequestInit = {
        method: request.method,
        body: body,
        cache: 'no-store',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        duplex: 'half',
        headers
    };

    try {
        const backendResponse = await fetch(targetUrl, requestOptions);

        // 3. 将后端的响应（包括状态码、Header、Body）原样返回给前端
        const responseHeaders = new Headers(backendResponse.headers);
        // 移除导致解析错误的 Header
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
        console.error('Frontend Proxy Error:', error);
        return NextResponse.json({message: (error as Error).message}, {status: 502});
    }
}

// 导出所有 HTTP 方法
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
