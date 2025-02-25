/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Forward environment variables from .env
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  },
};

module.exports = nextConfig;
