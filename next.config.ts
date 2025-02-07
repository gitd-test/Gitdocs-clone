import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    KUSTER_API_KEY: process.env.KUSTER_API_KEY,
  },
  /* config options here */
};

export default nextConfig;
