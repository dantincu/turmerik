import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    // This can help prevent Sass from holding onto old versions of files
    cache: false,
  },
  async redirects() {
    return [
      /* {
        source: "/",
        destination: "/app",
        permanent: true, // This sends a 308 status code (SEO friendly)
      } */
      /* {
        source: "/blog/:slug", // Wildcard matching
        destination: "/news/:slug",
        permanent: false, // This sends a 307 temporary status code
      }, */
    ];
  },
};

export default nextConfig;
