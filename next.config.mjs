/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "people.pic1.co",
      },
      {
        protocol: "https",
        hostname: "app-uploads-cdn.fera.ai",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: 'https',
        hostname: '**.wixmp.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ],
  },
};

export default nextConfig;
