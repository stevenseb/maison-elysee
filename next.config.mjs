/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.aceternity.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI,
    },
  };
  
  export default nextConfig;
  