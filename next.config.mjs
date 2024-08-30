/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['firebasestorage.googleapis.com'], // Replace with the domains from which you want to load images
      deviceSizes: [320, 420, 768, 1024, 1200], // Example device sizes
      imageSizes: [16, 32, 48, 64, 96], // Example image sizes
    },
    // Add other configurations you have here
  };
  
  export default nextConfig;
  