import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error('API environment variable is not defined');
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
