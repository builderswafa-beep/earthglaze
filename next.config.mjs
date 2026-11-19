/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Limit worker count to 1 and switch to in-process worker_threads
    // instead of child_process.fork() to eliminate OS process spawn EAGAIN errors
    cpus: 1,
    workerThreads: true,
  },
};

export default nextConfig;
