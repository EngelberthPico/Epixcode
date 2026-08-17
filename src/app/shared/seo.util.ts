import { stripLangPrefix } from './lang-url.util';

// Debe coincidir con el dominio real de producción — usado para construir
// URLs absolutas en canonical/hreflang/og:url (Google y las redes las
// ignoran si son relativas).
const SITE_URL = 'https://epixcode.com';

// Mapea la ruta "desnuda" (sin /es) a la clave del bloque seo.<key> en
// public/i18n/{en,es}.json. Si se agrega una ruta nueva a app.routes.ts,
// agregar su entrada aquí y su bloque seo.<key> en ambos JSON — si no,
// syncSeoTags cae al fallback 'home'.
const SEO_KEY_BY_PATH: Record<string, string> = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/how-it-works': 'howItWorks',
  '/contact': 'contact',
};

export interface RouteSeoContent {
  title: string;
  description: string;
}

export function seoKeyForPath(pathname: string): string {
  return SEO_KEY_BY_PATH[stripLangPrefix(pathname)] ?? 'home';
}

function setLinkTag(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

// Mantiene canonical + hreflang (en / es / x-default) y el <title> +
// meta description + Open Graph/Twitter Card sincronizados con la ruta y
// el idioma actual en cada navegación, para que Google entiende que / y
// /es/* (y cada par de páginas equivalentes, ej. /about y /es/about) son
// la misma página en dos idiomas, no contenido duplicado, y para que el
// snippet de búsqueda/pestaña del navegador reflejen la página actual.
//
// Límite conocido: los bots de vista previa social (WhatsApp, Slack,
// Facebook, Twitter) no ejecutan JavaScript, así que siempre leerán el
// og:title/description estático de index.html (inglés, contenido de
// Home) sin importar esta función — solo se resuelve con SSR/prerender.
export function syncSeoTags(pathname: string, seo: RouteSeoContent): void {
  const bare = stripLangPrefix(pathname);
  const enUrl = `${SITE_URL}${bare}`;
  const esUrl = bare === '/' ? `${SITE_URL}/es` : `${SITE_URL}/es${bare}`;
  const isEs = pathname === '/es' || pathname.startsWith('/es/');
  const canonicalUrl = isEs ? esUrl : enUrl;

  setLinkTag('canonical', canonicalUrl);
  setLinkTag('alternate', enUrl, 'en');
  setLinkTag('alternate', esUrl, 'es');
  setLinkTag('alternate', enUrl, 'x-default');

  document.title = seo.title;
  setMetaTag('name', 'description', seo.description);
  setMetaTag('property', 'og:title', seo.title);
  setMetaTag('property', 'og:description', seo.description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:locale', isEs ? 'es_ES' : 'en_US');
  setMetaTag('property', 'og:locale:alternate', isEs ? 'en_US' : 'es_ES');
  setMetaTag('name', 'twitter:title', seo.title);
  setMetaTag('name', 'twitter:description', seo.description);
}
