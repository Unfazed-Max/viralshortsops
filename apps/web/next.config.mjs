/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@viralshortsops/core',
    '@viralshortsops/db',
    '@viralshortsops/providers',
    '@viralshortsops/queue',
    '@viralshortsops/contracts',
    '@viralshortsops/utils',
  ],
  typescript: {
    // Skip type checking during build (will be done separately in CI)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting during build (will be done separately in CI)
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  webpack: (config) => {
    // Handle fluent-ffmpeg and other native modules
    config.externals.push({
      'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
    });
    return config;
  },
};

export default nextConfig;

