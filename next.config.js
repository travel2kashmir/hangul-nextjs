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
  }
}