import { stripLangPrefix } from './lang-url.util';

// Debe coincidir con el dominio real de producción — usado para construir
// URLs absolutas en canonical/hreflang (Google los ignora si son relativas).
const SITE_URL = 'https://epixcode.com';

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

// Mantiene canonical + hreflang (en / es / x-default) sincronizados con la
// ruta actual en cada navegación, para que Google entiende que / y /es/*
// (y cada par de páginas equivalentes, ej. /about y /es/about) son la misma
// página en dos idiomas, no contenido duplicado. Ver shared/lang-url.util.ts
// para la lógica del prefijo /es.
export function syncSeoTags(pathname: string): void {
  const bare = stripLangPrefix(pathname);
  const enUrl = `${SITE_URL}${bare}`;
  const esUrl = bare === '/' ? `${SITE_URL}/es` : `${SITE_URL}/es${bare}`;
  const isEs = pathname === '/es' || pathname.startsWith('/es/');

  setLinkTag('canonical', isEs ? esUrl : enUrl);
  setLinkTag('alternate', enUrl, 'en');
  setLinkTag('alternate', esUrl, 'es');
  setLinkTag('alternate', enUrl, 'x-default');
}
