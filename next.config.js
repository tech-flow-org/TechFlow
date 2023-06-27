// @ts-check
const API_END_PORT_URL = process.env.API_END_PORT_URL || 'https://drawing-board.antdigital.dev/';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // es 模块编译
  transpilePackages: ['kitchen-flow-editor', '@ant-design/pro-editor', 'zustand', 'leva'],

  async rewrites() {
    return [
      {
        source: '/api/openai-dev',
        destination: `${API_END_PORT_URL}/api/openai`,
      },
      {
        source: '/api/chain-dev',
        destination: `${API_END_PORT_URL}/api/chain`,
      },
      {
        source: '/api/sd/text2img',
        destination: `/api/sdserve`,
      },
      {
        source: '/api/network/proxy',
        destination: `/api/proxy`,
      },
    ];
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = withPWA(nextConfig);
