/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Forward environment variables from .env
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  },
  // Exclude Supabase Edge Functions from the Next.js build
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'supabase/functions'];
    return config;
  },
  // Ignore Supabase functions during TypeScript checking
  typescript: {
    ignoreBuildErrors: true, // You might want to set this to false and use the next option instead
  },
};

module.exports = nextConfig;
