interface FetchOptions extends RequestInit {
    data?: any;
    params?: Record<string, any>;
}

function serializeParams(params: Record<string, any>) {
    const parts = [];
    for (const key in params) {
        const value = params[key];
        if (value == null) continue;

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

export async function apiFetch(endpoint: string, {data, params, ...options}: FetchOptions = {}) {
    // 1. 处理 URL 参数
    let url = `/api/backend${endpoint}`;
    if (params) {
        url += '?' + serializeParams(params);
    }

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (options.method === 'POST') {
        if (data instanceof FormData) {
            options.body = data;
            headers.delete('Content-Type');
        } else {
            options.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(url, {...options, headers});
        //console.log('response:', response.json());

        if (!response.ok) {
            const errorData = await response.json();
            //console.log('response:',errorData);
            throw {
                status: errorData.status,
                message: errorData.message || '请求失败',
                errors: errorData.errors, // Laravel 的表单验证错误通常放在这里
            };
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
