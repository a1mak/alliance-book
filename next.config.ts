import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.SWAPI_GALLERY_URL}static/assets/img/**`),
    ],
  },
}

export default nextConfig
