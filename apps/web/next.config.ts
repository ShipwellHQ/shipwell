import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@shipwell/core"],
  serverExternalPackages: ["simple-git", "glob", "ignore", "tar"],
};

export default nextConfig;
