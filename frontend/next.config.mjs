/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.BACKEND_URL || process.env.BACKEND_API_URL;
    if (backend) {
      return [
        {
          source: '/api/:path*',
          destination: `${backend.replace(/\/$/, '')}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
