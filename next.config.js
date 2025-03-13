/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",  // 🚀 Asegura que Next.js usa SSR
  experimental: {
    serverActions: true,  // 🚀 Permite funciones dinámicas en App Router
  },
  reactStrictMode: true,
  trailingSlash: false,  // 🚀 Evita problemas con rutas
};

module.exports = nextConfig;
