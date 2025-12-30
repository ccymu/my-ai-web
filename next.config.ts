import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ 之前的错误原因：不要在这里写 serverExternalPackages 或 experimental
  // Clerk 现在会自动处理，不需要手动配置这一项

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default nextConfig;