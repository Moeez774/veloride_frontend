import type { NextConfig } from "next";

//put ignore eslint errors
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
