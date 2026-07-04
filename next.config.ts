import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Start: Hobby Grade Relax Mode Build Configurations */
  
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript type compilation errors.
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint validation errors.
    ignoreDuringBuilds: true,
  },

  /* End: Hobby Grade Relax Mode Build Configurations */
};

export default nextConfig;