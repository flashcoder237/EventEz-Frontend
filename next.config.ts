/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'eventez-backend.com', // Domaine de production
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Pour les images sur S3
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Pour les images sur S3
        pathname: '/**',
      }
    ],
    // Images par défaut pour le développement
    domains: [
      'localhost',
      '127.0.0.1',
      'eventez-backend.com',
    ],
  },
  // Configuration webpack si nécessaire
  // webpack: (config, { isServer }) => {
  //   config.resolve.alias['@'] = `${__dirname}/src`;
  //   return config;
  // },
  // Variables d'environnement côté client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  // Configuration des redirections
  async redirects() {
    return [
      // {
      //   source: '/dashboard',
      //   destination: '/dashboard',
      //   permanent: true,
      // },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  experimental: {
    turbo: { },
  },
};

module.exports = nextConfig;