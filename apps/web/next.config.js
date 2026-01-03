/** @type {import('next').NextConfig} */

const isStaticExport = process.env.NEXT_PUBLIC_BUILD_MODE === 'static';

const nextConfig = {
  // Enable static export when NEXT_PUBLIC_BUILD_MODE=static
  ...(isStaticExport && {
    output: 'export',
    // Disable image optimization for static export
    images: {
      unoptimized: true,
    },
    // Trailing slash for static hosting compatibility
    trailingSlash: true,
  }),

  // Common configuration for both modes
  reactStrictMode: true,

  // Transpile monorepo packages
  transpilePackages: ['@quizzme/api-contracts', '@quizzme/storage'],

  // Environment variables available at build time
  env: {
    NEXT_PUBLIC_BUILD_MODE: process.env.NEXT_PUBLIC_BUILD_MODE || 'server',
  },
};

module.exports = nextConfig;
