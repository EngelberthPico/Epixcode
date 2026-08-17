# Epix Code — epixcode.com

Sitio web corporativo de **Epix Code**, empresa de automatización de procesos, desarrollo web e integración de inteligencia artificial (con un departamento de marketing complementario). Angular standalone, bilingüe (inglés/español), compilado como sitio 100% estático y desplegado en Hostinger sin backend propio.

Las reglas de negocio, marca y seguridad obligatorias del proyecto viven en [`CLAUDE.md`](./CLAUDE.md) — léelo antes de tocar contenido, colores, formularios o rutas.

## Stack

- **Angular 22** (standalone components, sin SSR) + TypeScript
- **SCSS** con variables de marca propias (`src/styles/_variables.scss`) — sin Bootstrap ni ningún framework de UI
- **Angular Router**, una ruta por sección, con revelado al hacer scroll vía `ScrollRevealDirective` (`appScrollReveal`)
- **@ngx-translate** para el bilingüe (JSON en `public/i18n/`), con el idioma resuelto desde la URL (ver abajo), no desde `localStorage`
- **Reactive Forms** para el formulario de contacto, enviado a un endpoint externo (Formspree), con honeypot anti-spam
- **Vitest** para pruebas unitarias

## Cómo correr el proyecto

```bash
npm install
npm start          # ng serve — http://localhost:4200
```

```bash
npm run build       # build de desarrollo, dist/epixcode/
npm test            # pruebas unitarias con Vitest
```

Para el build que se sube a Hostinger, usa siempre la configuración de producción (ver sección de despliegue):

```bash
ng build --configuration production
```

## Estructura del proyecto

```
src/
  app/
    app.routes.ts         # rutas EN/ES (ver "Idioma y rutas" abajo)
    app.ts                 # sincroniza idioma + SEO en cada navegación
    pages/                 # una carpeta por sección: home, about, services,
                            # how-it-works, contact, projects (en pausa)
    shared/
      lang-url.util.ts      # única fuente de verdad del prefijo /es
      lang-link.pipe.ts     # pipe `| langLink` para routerLink internos
      seo.util.ts           # canonical + hreflang dinámicos por ruta
      scroll-reveal.directive.ts
      navbar/ footer/ whatsapp-button/ image-placeholder/
  styles/
    _variables.scss         # $color-crema, $color-negro, $color-oliva, tipografía
  styles.scss                # estilos globales (botones, scroll-reveal, etc.)
public/
  i18n/en.json, es.json      # textos del sitio en ambos idiomas
  .htaccess                  # HTTPS forzado, fallback SPA, cabeceras de seguridad
  logo*.png, Fondo*.png       # assets de marca
```

## Idioma y rutas

El español vive bajo el prefijo `/es/*` (ej. `/es/services`); el inglés es la ruta "desnuda" (ej. `/services`), y es el idioma por defecto. La URL es la **única** fuente de verdad del idioma activo — no se guarda preferencia en `localStorage` — para que cada campaña de ads pueda apuntar a un link fijo por idioma y siempre aterrice donde corresponde.

- `shared/lang-url.util.ts` — helpers `langFromUrl` / `stripLangPrefix` / `withLang`.
- `shared/lang-link.pipe.ts` — pipe `| langLink` usado en todo `routerLink` interno para que el link generado respete el idioma actual.
- `app.routes.ts` — cada nivel (raíz y `/es`) tiene su propio wildcard `**`, en el orden correcto, para que una URL rota bajo `/es/*` caiga de vuelta en `/es` y no cruce a inglés.
- `app.ts` — en cada navegación sincroniza `ngx-translate`, `document.documentElement.lang` y, vía `shared/seo.util.ts`, las etiquetas `canonical`/`hreflang` para que Google entienda que cada página y su equivalente en el otro idioma son la misma página.

La ruta `/projects` está **en pausa**: el componente existe en `src/app/pages/projects/` pero no está enlazado en el navbar ni en `app.routes.ts`. No se borra — se reactiva cuando el usuario lo pida explícitamente.

## Despliegue (Hostinger)

1. `ng build --configuration production` genera el sitio estático en `dist/epixcode/browser/`.
2. Sube el contenido de esa carpeta a la raíz pública del hosting (plan Single, tipo PHP/HTML).
3. Verifica que `public/.htaccess` haya viajado con el build (fuerza HTTPS, hace el fallback de rutas de Angular Router a `index.html`, y agrega cabeceras de seguridad básicas).
4. El dominio y el correo corporativo se gestionan por separado vía Google Workspace — no forman parte de este repo.

No hay base de datos, autenticación de usuarios ni backend propio en esta fase — ver "Qué NO construir en esta fase" en `CLAUDE.md`.
