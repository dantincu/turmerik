import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  outputFileTracingIncludes: {
    "/*": ["./src/data/**/*", "./src/config/**/*"], // Include the data folder in the deployment bundle,
  },
};

export default nextConfig;
