/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'earthglazebeauty.com' }],
        destination: 'https://www.earthglazebeauty.com/:path*',
        permanent: true,
      },
    ];
  },
  experimental: {
    // Limit worker count to 1 and switch to in-process worker_threads
    // instead of child_process.fork() to eliminate OS process spawn EAGAIN errors
    cpus: 1,
    workerThreads: true,
  },
};

export default nextConfig;
