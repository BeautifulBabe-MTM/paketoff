import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', 

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paketov.net.ua',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;