/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'upload-static.hoyoverse.com',
      'static.wikia.nocookie.net',
      'webstatic-sea.mihoyo.com'
    ],
    // 外部画像最適化の可否を設定
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig; 