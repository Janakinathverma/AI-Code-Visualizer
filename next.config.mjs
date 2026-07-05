/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
              "style-src 'self' 'unsafe-inline' https://clerk.com https://*.clerk.com",
              "img-src 'self' data: blob: https://clerk.com https://*.clerk.com https://img.clerk.com",
              "font-src 'self' https://clerk.com https://*.clerk.com",
              "connect-src 'self' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
              "frame-src 'self' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
