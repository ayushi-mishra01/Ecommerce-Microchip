/** @type {import('next').NextConfig} */
const redirects = require('./redirects');

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost', 
      process.env.NEXT_PUBLIC_SERVER_URL, 
      'mm.digikey.com',
      'docs.broadcom.com',
      'www.microchipusa.com'
    ].filter(Boolean)
      .map(url => url.replace(/https?:\/\//, '')),
  },
  redirects,
  async headers() {
    const headers = [];

    // Prevent search engines from indexing the site if it is not live
    // This is useful for staging environments before they are ready to go live
    // To allow robots to crawl the site, use the `NEXT_PUBLIC_IS_LIVE` env variable
    // You may want to also use this variable to conditionally render any tracking scripts
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      });
    }

    // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
    // It works by explicitly whitelisting trusted sources of content for your website
    // This will block all inline scripts and styles except for those that are allowed
    // headers.push({
    //   source: '/(.*)',
    //   headers: [
    //     {
    //       key: 'Content-Security-Policy',
    //       value: `img-src 'self' https://mm.digikey.com https://docs.broadcom.com https://www.microchipusa.com`,
    //     },
    //   ],
    // });

   

    return headers;
  },
};

module.exports = nextConfig;