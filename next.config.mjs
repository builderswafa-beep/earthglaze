/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Limit worker count to 1 to prevent EAGAIN process-spawn exhaustion in constrained environments
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
