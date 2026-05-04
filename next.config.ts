import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    allowedDevOrigins: ['shop.gzdsx.cn', '192.168.0.104'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shop.gzdsx.cn',
            },
        ],
    },
    async rewrites() {
        return [
            {
                // 老的路由地址
                source: '/auth/google/callback',
                // 映射到 Next-Auth 实际监听的 API 地址
                destination: '/api/auth/callback/google',
            },
        ];
    },
};

export default nextConfig;
