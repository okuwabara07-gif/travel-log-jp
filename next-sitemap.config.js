/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://travel-log-jp.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ['https://travel-log-jp.vercel.app/sitemap.xml'],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}
