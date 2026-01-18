import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // This can help prevent Sass from holding onto old versions of files
    cache: false,
  },
};

export default nextConfig;
