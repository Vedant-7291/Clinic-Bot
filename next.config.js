// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
    VERIFY_TOKEN: process.env.VERIFY_TOKEN,
    PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  },
  // If you need to add custom headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;