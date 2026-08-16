export const LANG_STORAGE_KEY = 'epixcode-lang';

export const SUPPORTED_LANGS = ['es', 'en'] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];
