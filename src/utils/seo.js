import { routeSeoMap, stringifyStructuredData } from '../config/seo'

const defaultSeo = routeSeoMap.home

const upsertHeadElement = (selector, tagName, attributes = {}) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement(tagName)

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })

    document.head.append(element)
  }

  return element
}

const setMeta = (selector, attribute, value, createAttributes) => {
  if (!value) {
    return
  }

  const element = upsertHeadElement(selector, 'meta', createAttributes)

  element.setAttribute(attribute, value)
}

const setCanonical = (href) => {
  const canonical = upsertHeadElement('link[rel="canonical"]', 'link', { rel: 'canonical' })

  canonical.setAttribute('href', href)
}

const setStructuredData = (seo) => {
  const script = upsertHeadElement('script#site-jsonld', 'script', {
    id: 'site-jsonld',
    type: 'application/ld+json',
  })

  script.textContent = stringifyStructuredData(seo)
}

export const applyRouteSeo = (routeMeta = {}) => {
  const seo = {
    ...defaultSeo,
    ...routeMeta,
  }

  document.title = seo.title
  setMeta('meta[name="description"]', 'content', seo.description, { name: 'description' })
  setMeta('meta[name="keywords"]', 'content', seo.keywords, { name: 'keywords' })
  setMeta('meta[name="robots"]', 'content', seo.robots, { name: 'robots' })
  setMeta('meta[property="og:title"]', 'content', seo.title, { property: 'og:title' })
  setMeta('meta[property="og:description"]', 'content', seo.description, {
    property: 'og:description',
  })
  setMeta('meta[property="og:url"]', 'content', seo.canonical, { property: 'og:url' })
  setMeta('meta[name="twitter:title"]', 'content', seo.title, { name: 'twitter:title' })
  setMeta('meta[name="twitter:description"]', 'content', seo.description, {
    name: 'twitter:description',
  })
  setCanonical(seo.canonical)
  setStructuredData(seo)
}
