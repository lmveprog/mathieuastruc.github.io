/** @type {import('next').NextConfig} */
const nextConfig = {
  // imapflow (lecture gmail du /admin) tourne cote node, pas besoin de le bundler
  experimental: { serverComponentsExternalPackages: ["imapflow"] },
  // /matheus (et /matheus/) -> le dashboard statique du hub matheusgen
  async rewrites() {
    return [
      { source: "/matheus", destination: "/matheus/index.html" },
      { source: "/matheus/", destination: "/matheus/index.html" },
    ];
  },
  async headers() {
    return [
      // le /admin ne doit jamais etre indexe ni mis en cache
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // Force HTTPS for 1 year + include subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Control referrer info sent to other sites
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable browser features not needed
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://lavalley.xyz",
              "media-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // XSS protection for older browsers
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
