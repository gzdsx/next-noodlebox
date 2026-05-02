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
};

export default nextConfig;
