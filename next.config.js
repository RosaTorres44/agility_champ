/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Fuerza la exportación estática
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
