import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Hanya gunakan standalone saat build via Docker, bukan di Vercel
  output: process.env.VERCEL ? undefined : "standalone"
}

export default nextConfig
