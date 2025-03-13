/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Asegura que estás usando static export
  async exportPathMap(defaultPathMap) {
    delete defaultPathMap["/admin"]; // Excluir la página de admin
    return defaultPathMap;
  },
};

module.exports = nextConfig;
