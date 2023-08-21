// @ts-check
const API_END_PORT_URL = process.env.API_END_PORT_URL || 'https://techflow.antdigital.dev';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const monacoRules = [
  {
    test: /\.ttf$/,
    type: 'asset/resource',
  },
];
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
  transpilePackages: [
    '@ant-design/pro-flow-editor',
    '@ant-design/pro-editor',
    'zustand',
    'leva',
    'ahooks',
  ],
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
        source: '/api/embeddings-dev',
        destination: `${API_END_PORT_URL}/api/embeddings`,
      },
      {
        source: '/api/sd/text2img',
        destination: `/api/sdserve`,
      },
      {
        source: '/api/network/proxy',
        destination: `/api/proxy`,
      },
      {
        source: '/api/dingding/send',
        destination: `/api/dingbot`,
      },
    ];
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  webpack(config, isServer) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'markdown', 'yaml'],
          filename: 'static/[name].worker.js',
        }),
      );
      config.module.rules.push(...monacoRules);
    }

    return config;
  },
  reactProductionProfiling: true,
};

//@ts-ignore
module.exports = withPWA(nextConfig);
