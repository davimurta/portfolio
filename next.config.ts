import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Only allow local images (uploads) - no external URLs for security
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/fiber', '@react-three/drei'],
  },
  // Mark pg and prisma as server-only external packages
  serverExternalPackages: ['pg', '@prisma/client', '@prisma/adapter-pg', 'bcryptjs'],
};

export default nextConfig;
