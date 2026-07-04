import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Start: Hobby Grade Relax Mode Build Configurations */
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript type compilation errors.
    ignoreBuildErrors: true,
  }
  /* End: Hobby Grade Relax Mode Build Configurations */
};

export default nextConfig;