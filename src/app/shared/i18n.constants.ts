export const SUPPORTED_LANGS = ['es', 'en'] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
