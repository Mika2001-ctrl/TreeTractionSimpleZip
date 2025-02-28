/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/password",
        permanent: false, // Use false to allow future changes.
      },
    ];
  },
};

module.exports = nextConfig;
