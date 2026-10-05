import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/(.*)", headers: [
      {key:"X-Content-Type-Options",value:"nosniff"},
      {key:"X-Frame-Options",value:"DENY"},
      {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
      {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
      {key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains"},
      {key:"Content-Security-Policy",value:"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"}
    ]}];
  },
  async redirects() {return [
    {source:"/services/sites-internet",destination:"/services/sites-web",permanent:true},
    {source:"/services/applications",destination:"/services/applications-web",permanent:true},
    {source:"/services/outils-de-gestion",destination:"/services/solutions-gestion",permanent:true}
  ];}
};
export default nextConfig;
