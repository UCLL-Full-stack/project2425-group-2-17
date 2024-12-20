/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  experimental: {
    externalDir: true, // Allow files outside the Next.js project root
  },
  i18n, // Include the i18n configuration
};

module.exports = nextConfig;
