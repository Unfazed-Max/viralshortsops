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

