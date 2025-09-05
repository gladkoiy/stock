import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    domains: ['api.komandor-stock.ru'],
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/stock' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/stock' : '',
};

export default nextConfig;
