/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
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
          // Content Security Policy — allows self + Groq API
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://api.groq.com",
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
