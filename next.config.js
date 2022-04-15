/** @type {import('next').NextConfig} */
const nextConfig = {
  env:{
    serverURL:"http://103:136:36:27",
    port:"7860"
  }
}
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://103.136.36.27:7860/:path*' // Proxy to Backend
      }
    ]
  },
  i18n:{
    locales:['en-US', 'fr', 'nl-NL'],
    defaultLocale:'en',
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
        // an optional http field can also be used to test
        // locale domains locally with http instead of https
        http: true,
      },
    ],  
  }
}