/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'api.qrserver.com'],
  },
};

// Force cache rebuild
module.exports = nextConfig;
