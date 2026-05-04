import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    allowedDevOrigins: ['staging.noodlebox.ie', '192.168.0.104'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'staging.noodlebox.ie',
            },
        ],
    },
    async rewrites() {
        return [

        ];
    },
};

export default nextConfig;
