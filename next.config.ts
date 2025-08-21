import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // 이미지 최적화 완전 비활성화
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러 무시
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 에러 무시
  },
};

export default nextConfig;
