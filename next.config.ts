import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'localhost:8000',
      'eventez-backend.com', // Votre domaine de production
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'eventez-backend.com', // Votre domaine de production
        pathname: '/media/**',
      }
    ]
  },
  // Configuration webpack si nécessaire
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = `${__dirname}/src`;
    return config;
  },
  // Variables d'environnement côté client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  }
};

export default nextConfig;
