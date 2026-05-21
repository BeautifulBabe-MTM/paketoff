import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paketov.net.ua',
        pathname: '/**', // Разрешаем любые пути к картинкам на этом домене
      },
    ],
  },
};

export default nextConfig;