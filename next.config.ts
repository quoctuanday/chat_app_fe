import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/message',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
