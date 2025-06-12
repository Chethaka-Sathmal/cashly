import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // new URL("https://img.clerk.com/**"),
      // new URL("https://e125vo1rk1.ufs.sh/"),
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "e125vo1rk1.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
