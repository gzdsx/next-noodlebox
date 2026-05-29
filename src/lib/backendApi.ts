import Cookies from "js-cookie";

interface FetchOptions extends RequestInit {
    data?: any;
    params?: Record<string, any>;
}

function serializeParams(params: Record<string, any>) {
    const parts = [];
    for (const key in params) {
        const value = params[key];
        if (value == null || value === 'all') continue;

        if (Array.isArray(value)) {
            value.forEach(item => {
                parts.push(`${key}[]=${item}`);
            });
        } else {
            parts.push(`${key}=${value}`);
        }
    }
    return parts.join('&');
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function apiFetch(endpoint: string, {data, params, ...options}: FetchOptions = {}) {
    // 1. 处理 URL 参数
    let url = `${BASE_URL}${endpoint}`;
    if (params) {
        url += '?' + serializeParams(params);
    }

    // 2. 默认 Headers 配置
    const headers = new Headers({
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    // 3. 自动注入 Token (如果是 Token 认证方案)
    const token = Cookies.get('adminToken');
    headers.set('Authorization', `Bearer ${token}`);

    if (data) {
        if (data instanceof FormData) {
            options.body = data;
            headers.delete('Content-Type');
        } else {
            options.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: headers,
            credentials: 'include',
        });

        // 4. 统一错误拦截
        if (response.status === 401) {
            // 处理未授权，例如跳转登录
            if (typeof window !== 'undefined') {
                Cookies.remove('adminToken');
                Cookies.remove('adminUser');
                window.location.reload();
            }
        }

        // 204 No Content 处理
        if (response.status === 204) {
            throw {
                status: 204,
                message: 'No Content',
            }
        }

        const text = await response.text();
        console.log('text:', text);
        return text;

        if (!response.ok) {
            const errorData = await response.json();
            //console.log('errorData:', errorData);
            throw {
                status: errorData.status,
                message: errorData.message || '请求失败',
                errors: errorData.errors, // Laravel 的表单验证错误通常放在这里
            }
        }

        return await response.json();
    } catch (error) {
        return Promise.reject(error);
    }
}

export function apiGet(endpoint: string, params?: Record<string, any>, options?: FetchOptions) {
    return apiFetch(endpoint, {...options, params, method: 'GET'});
}

export function apiPost(endpoint: string, data?: any, options?: FetchOptions) {
    return apiFetch(endpoint, {...options, data, method: 'POST'});
}

export function apiPut(endpoint: string, data?: any, options?: FetchOptions) {
    return apiFetch(endpoint, {...options, data, method: 'PUT'});
}

export function apiDelete(endpoint: string, data?: any, options?: FetchOptions) {
    return apiFetch(endpoint, {...options, data, method: 'DELETE'});
}
