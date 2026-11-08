import assert from 'node:assert/strict'
import test from 'node:test'

import { buildArticlePage } from './content-pages.mjs'

const template = `<!doctype html>
<html><head><title>Original</title>
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="robots" content="">
<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:url" content="">
<meta property="og:type" content="website">
<meta name="twitter:title" content="">
<meta name="twitter:description" content="">
<link rel="canonical" href="https://xiranya.cn/">
<script id="site-jsonld" type="application/ld+json">{}</script>
</head><body><div id="app"></div></body></html>`

test('article prerender preserves semantic markup and removes executable HTML', () => {
  const html = buildArticlePage(template, {
    slug: 'safe-article',
    title: 'Safe article',
    htmlContent:
      '<h2>Heading</h2><p>Text</p><script>globalThis.pwned = true</script><img src="/cover.png" onerror="alert(1)"><a href="javascript:alert(1)">bad link</a>',
  })

  assert.match(html, /<h2>Heading<\/h2>/)
  assert.match(html, /<p>Text<\/p>/)
  assert.doesNotMatch(html, /globalThis\.pwned|onerror|javascript:/)
  assert.match(html, /rel="noopener noreferrer"/)
})
