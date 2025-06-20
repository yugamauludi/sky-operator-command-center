const nextConfig = {
  images: {
    domains: ['devtest09.skyparking.online'],
  },
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error('API environment variable is not defined');
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
