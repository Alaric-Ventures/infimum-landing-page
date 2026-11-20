import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * Legacy routes from the previous multi-page site. Each page is consolidated
 * into the most relevant section of the new single-page experience.
 */
const legacyRedirects = [
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/about.html", destination: "/#about", permanent: true },
  { source: "/services.html", destination: "/#services", permanent: true },
  { source: "/whyus.html", destination: "/#why-us", permanent: true },
  { source: "/contact.html", destination: "/#contact", permanent: true },
  {
    source: "/content-mang.html",
    destination: "/#service-content-management",
    permanent: true,
  },
  {
    source: "/mobile-app.html",
    destination: "/#service-mobile-application-development",
    permanent: true,
  },
  {
    source: "/app-development.html",
    destination: "/#service-application-development",
    permanent: true,
  },
  {
    source: "/web-development.html",
    destination: "/#service-website-design-development",
    permanent: true,
  },
  {
    source: "/infrastructure.html",
    destination: "/#service-infrastructure-cloud",
    permanent: true,
  },
  {
    source: "/office365.html",
    destination: "/#service-microsoft-365",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return legacyRedirects;
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
