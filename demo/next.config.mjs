/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isolate multi-loop concurrent builds: E2E uses NEXT_DIST_DIR=.next-e2e so a
  // parallel `next build` on `.next` cannot wipe the production server mid-suite.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? 'local',
    NEXT_PUBLIC_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    NEXT_PUBLIC_DEMO_VERSION: '0.1.0',
  },
};
export default nextConfig;
