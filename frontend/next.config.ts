/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // A veces unsplash usa este otro
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Ya te lo dejo preparado para tu backend
      }
    ],
  },
};

export default nextConfig;