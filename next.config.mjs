/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Tree-shake heavy 3D / animation libraries at the import level.
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      'lenis',
    ],
  },

  // Transpile ESM-only packages that ship untranspiled sources.
  transpilePackages: ['three', 'lenis'],

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  webpack: (config) => {
    // Allow importing raw shader sources as strings.
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
