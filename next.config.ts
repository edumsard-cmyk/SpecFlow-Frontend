import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'pdf-parse',
    '@napi-rs/canvas',
    'fluent-ffmpeg',
    '@ffmpeg-installer/ffmpeg',
  ],
  // Binários nativos do canvas para extração de PDF na Vercel/Linux
  outputFileTracingIncludes: {
    '/api/projects/from-document': [
      './node_modules/pdf-parse/**/*',
      './node_modules/@napi-rs/canvas/**/*',
      './node_modules/@napi-rs/canvas-linux-x64-gnu/**/*',
      './node_modules/@napi-rs/canvas-linux-x64-musl/**/*',
    ],
  },
};

export default nextConfig;
