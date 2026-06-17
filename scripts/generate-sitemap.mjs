import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'
import { SitemapStream, streamToPromise } from 'sitemap'

import { siteBaseUrl, siteNavigationLinks } from '../src/config/seo.js'

const now = new Date().toISOString().split('T')[0]

const sitemapEntries = siteNavigationLinks
  .filter((link) => link.type === 'router')
  .map((link) => {
    const isHome = link.url === `${siteBaseUrl}/`

    return {
      url: link.url,
      lastmod: now,
      changefreq: isHome ? 'weekly' : 'weekly',
      priority: isHome ? 1.0 : 0.8,
    }
  })

const stream = new SitemapStream({
  hostname: siteBaseUrl,
  lastmodDateOnly: true,
  xmlns: {
    news: false,
    xhtml: false,
    image: false,
    video: false,
  },
})

const xml = await streamToPromise(Readable.from(sitemapEntries).pipe(stream))
const prettyXml = xml
  .toString()
  .replace(/(<\/?urlset[^>]*>)/g, '$1\n')
  .replace(/(<url>)/g, '  $1\n')
  .replace(/(<\/url>)/g, '  $1\n')
  .replace(/(<loc>.*<\/loc>)/g, '    $1\n')
  .replace(/(<lastmod>.*<\/lastmod>)/g, '    $1\n')
  .replace(/(<changefreq>.*<\/changefreq>)/g, '    $1\n')
  .replace(/(<priority>.*<\/priority>)/g, '    $1\n')
  .replace(/\n\n+/g, '\n')

const outputPath = resolve(process.cwd(), 'public', 'sitemap.xml')
writeFileSync(outputPath, prettyXml)

console.log(`Sitemap generated with ${sitemapEntries.length} URLs: ${outputPath}`)
