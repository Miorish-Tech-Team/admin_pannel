import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
  {
    protocol: "https",
    hostname: "vuxmkjuealwqaincilsy.supabase.co",
    port: "",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "8000",
    pathname: "/**",
  },
],
  },
};

export default nextConfig;