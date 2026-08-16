import { SupportedLang } from './i18n.constants';

// El español vive bajo el prefijo /es (ej. /es/services); el inglés es la
// ruta "desnuda" (ej. /services). El prefijo en la URL es la única fuente
// de verdad del idioma — así cada campaña de ads puede apuntar a un link
// distinto por idioma y siempre aterriza en el idioma correcto.
const ES_PREFIX = '/es';

export function langFromUrl(url: string): SupportedLang {
  return url === ES_PREFIX || url.startsWith(`${ES_PREFIX}/`) ? 'es' : 'en';
}

export function stripLangPrefix(url: string): string {
  if (url === ES_PREFIX) return '/';
  if (url.startsWith(`${ES_PREFIX}/`)) return url.slice(ES_PREFIX.length);
  return url;
}

export function withLang(path: string, lang: SupportedLang): string {
  const bare = stripLangPrefix(path);
  if (lang !== 'es') return bare;
  return bare === '/' ? ES_PREFIX : `${ES_PREFIX}${bare}`;
}
