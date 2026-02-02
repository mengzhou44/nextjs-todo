/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeGraphQL uses class names for schema types; server minification mangles them (e.g. to "s").
  experimental: {
    serverMinification: false,
  },
};

module.exports = nextConfig;
