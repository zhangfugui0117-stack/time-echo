import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许通过 Cloudflare Tunnel 访问时正常加载 _next/ 静态资源
  allowedDevOrigins: [
    "favors-planet-tin-rural.trycloudflare.com",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
