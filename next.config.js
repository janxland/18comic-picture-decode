/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
    async rewrites() {
        return [
            {
            source: '/api/request/api/scrape/:path*',
            destination: 'http://service-pjors7ji-1257251314.hk.apigw.tencentcs.com/puppeteer/:path*', // 将请求代理到指定的目标 URL
            },
        ];
    },
};

module.exports = nextConfig;
