/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'] // google auth
  },
  // redirects pages
  redirects: async () => [
    {
      source: '/auth',
      destination: '/auth/register',
      permanent: true,
    }
  ]
}

module.exports = nextConfig;
