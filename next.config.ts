import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "thumbnail.komiku.org",
            },
            {
                protocol: "https",
                hostname: "cdn.komiku.id",
            },
            {
                protocol: "https",
                hostname: "**.komiku.org",
            },
            {
                protocol: "https",
                hostname: "**.komiku.id",
            },
            {
                protocol: "https",
                hostname: "**.bacakomik.my",
            },
            {
                protocol: "https",
                hostname: "i2.wp.com",
            },
            {
                protocol: "https",
                hostname: "**.komikstation.org",
            },
        ],
    },
};

export default nextConfig;
