import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러 무시
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 에러 무시
  },
};

export default nextConfig;
