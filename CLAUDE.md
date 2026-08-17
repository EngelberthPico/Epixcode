# CLAUDE.md — epixcode.com

Este documento define el contexto y las reglas obligatorias para construir este proyecto. Aplican a todo el código y contenido nuevo, sin excepción, salvo que el usuario apruebe explícitamente una excepción puntual.

## Contexto del proyecto

- **Qué es:** Sitio web corporativo de **Epix Code**, una empresa enfocada en optimizar procesos de negocio mediante automatización, desarrollo web, e integración de herramientas de inteligencia artificial. Cuenta también con un departamento de marketing.
- **Enfoque de marca — MUY IMPORTANTE:** Este es un sitio de **empresa**, no un portafolio personal. Nunca mencionar que el desarrollador es "junior" ni enmarcar el contenido como el trabajo de una sola persona en formación. Usar siempre "nosotros" / "nuestro equipo", nunca "yo" / "mi experiencia".
- **Audiencia principal:** Clientes en Estados Unidos, con posibilidad de clientes en Colombia también. Sitio bilingüe (inglés/español).
- **Framework:** Angular (standalone components), compilado como sitio estático con `ng build`.
- **Hosting:** Hostinger, plan Single, tipo "PHP/HTML" — sin backend propio corriendo en el servidor.
- **Dominio y correo:** `epixcode.com`, gestionado vía Google Workspace.
- **Formulario de contacto:** se envía a través de un servicio externo (Formspree o Web3Forms), no hay backend propio que lo procese.
- **Sin base de datos propia, sin autenticación de usuarios, sin carrito de compras** en esta fase del proyecto.

## Reglas de seguridad obligatorias

### 1. XSS y contenido dinámico
- Nunca usar `[innerHTML]` con contenido que no esté 100% controlado por el propio código.
- No usar `DomSanitizer.bypassSecurityTrustHtml()` (ni variantes `bypassSecurityTrust*`) salvo que el usuario lo pida explícitamente y justifique el motivo.
- Confiar en el escape automático de Angular al usar interpolación `{{ }}`.

### 2. Secretos y llaves de API
- Nunca hardcodear API keys, tokens, contraseñas o credenciales en el código fuente, ni en `environment.ts` / `environment.prod.ts` si son sensibles.
- Si se necesita una llave pública (ej. endpoint de Formspree/Web3Forms), usar únicamente la versión pública/restringida documentada por el proveedor para uso en frontend.
- No crear ni commitear archivos `.env` con valores reales.

### 3. Build de producción
- El build de producción debe generarse con `ng build --configuration production`.
- Verificar que `sourceMap` esté en `false` para la configuración de producción en `angular.json`.

### 4. HTTPS
- Asumir siempre que el sitio se sirve por HTTPS (SSL gratuito de Hostinger).
- No generar enlaces, recursos ni llamadas hardcodeadas con `http://` — usar siempre `https://` o rutas relativas.
- Si se genera un archivo `.htaccess`, debe incluir una regla que fuerce la redirección de `http` a `https`.

### 5. Formulario de contacto
- Incluir un campo "honeypot" oculto para mitigar spam automatizado.
- Validar en el cliente (campos requeridos, formato de email) como buena práctica de UX.
- El formulario debe enviarse directo al endpoint del servicio externo indicado — no crear un backend propio para procesarlo salvo instrucción explícita.

### 6. Dependencias
- Mantener las dependencias de `package.json` en versiones estables y recientes.
- Evitar agregar librerías externas innecesarias; preferir soluciones nativas de Angular/CSS cuando sea razonable.
- No instalar paquetes sin verificar que sean de fuentes confiables (npm oficial, buena reputación/descargas).
- Antes de instalar algo, y periódicamente después, confirmar que realmente se usa en el código — Bootstrap se instaló al inicio del proyecto para el grid/utilidades y terminó sin usarse en ningún componente; se detectó y se quitó (ver "Stack técnico" abajo). El sitio no usa ningún framework de CSS: solo SCSS propio con las variables de marca.
- Iconos: no se instala ninguna librería de iconos (`lucide-angular`, `@fortawesome/*`, etc.). Los iconos son SVG inline con paths copiados a mano de [Lucide](https://lucide.dev) (`curl -sL https://unpkg.com/lucide-static@latest/icons/{nombre}.svg`, nunca vía WebFetch, para no arriesgar que un modelo intermedio altere las coordenadas exactas del path), manteniendo la convención `stroke="currentColor" stroke-width="1.6"` ya usada en todo el sitio.

### 7. Privacidad (audiencia principal en EE. UU.)
- Si el formulario de contacto recoge nombre, correo u otro dato personal, incluir una línea breve y visible indicando para qué se usarán esos datos (ej. "Solo usamos tu información para responder tu mensaje, nunca la compartimos con terceros").
- No es necesario citar ninguna ley específica en el sitio en esta etapa — un aviso claro y honesto es suficiente para un sitio pequeño que recién arranca. Si el negocio crece y maneja datos de muchos clientes en California, valdría la pena revisar en ese momento si aplica la CCPA (California Consumer Privacy Act) con un abogado. Esto no es asesoría legal, es orientación general.

### 8. Cabeceras de seguridad (`public/.htaccess`, ya implementadas)
```
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://formspree.io; form-action 'self' https://formspree.io; frame-ancestors 'self'; object-src 'none'; base-uri 'self';"
```
- La CSP se verificó en navegador (build de producción, sin violaciones en consola) contra lo que el sitio realmente carga: gtag.js de GA4, la hoja de Google Fonts + sus `.woff2`, el `fetch` del formulario a Formspree, y el `<style>` que Angular inyecta por componente (de ahí el `'unsafe-inline'` en `style-src` — este hosting estático no puede generar un nonce por request).
- Si se agrega un script/dominio de terceros nuevo (otro pixel, un embed, etc.), hay que sumarlo a la directiva de CSP correspondiente en `.htaccess` **y volver a probar en navegador** (revisar la consola por `Refused to ...` / `Content-Security-Policy`) — no asumir que va a funcionar solo por agregarlo al código.
- `.htaccess` también trae compresión (`mod_deflate`) y cache (`mod_expires` + `Cache-Control`): el bundle de Angular (`main-*.js`/`styles-*.css`, con hash de contenido por `outputHashing:"all"`) se cachea un año como `immutable`; `index.html` nunca se cachea (para que un redeploy se vea de inmediato); imágenes/favicon se cachean 1 mes.

### 9. Imágenes de marca
- El sitio usa imágenes generadas con IA para su identidad visual (fondos de sección) más los assets de logo.
- **Formato según transparencia**: los fondos de sección son opacos (sin canal alpha) y van en **JPEG** (~85% de calidad vía `sips -s format jpeg -s formatOptions 85`) — un PNG para una imagen fotográfica/con degradados pesa 5-10x más sin ganar nada, ya que no hay transparencia que preservar. Los logos (`logo-icon.png`, `logofondonegro.png`, `favicon-512.png`) sí tienen alpha y se quedan en PNG. Antes de convertir una imagen nueva, comprobar con `sips -g hasAlpha archivo.png` — si es `no`, va en JPEG.
- Al reemplazar/agregar una imagen de fondo, verificar visualmente el resultado (Read del archivo generado) antes de commitear — a esta calidad no debería notarse el compression, pero confirmar caso por caso.

### 10. SEO básico (index.html + rutas)
- `src/index.html` trae `title`, `meta description`, Open Graph, Twitter Card y JSON-LD (`Organization`) estáticos — es lo único que ven los bots que no ejecutan JavaScript (vistas previas de WhatsApp/Slack/redes al compartir un link). Esos bots **nunca** ven el valor por-ruta que pone `seo.util.ts` (ver abajo), así que el bloque de title/description/OG se queda fijo en el copy de Home en inglés a propósito; si cambia el copy principal del Home o el dominio, hay que actualizarlo aquí también. El JSON-LD sí es el mismo en toda ruta/idioma a propósito (describe la organización, no la página).
- `src/app/shared/seo.util.ts` sincroniza, en cada navegación: `canonical` + `hreflang` (`en`/`es`/`x-default`, para que Google entienda que cada página y su par en el otro idioma —ej. `/services` y `/es/services`— son la misma página en dos idiomas, no contenido duplicado) **y también** `<title>`, `meta[name=description]`, Open Graph y Twitter Card, tomando el copy de `seo.<key>.title` / `seo.<key>.description` en `public/i18n/{en,es}.json` según la ruta actual (mapeo en `SEO_KEY_BY_PATH` dentro del propio archivo). Esto sí lo ve Googlebot (renderiza JS) y la pestaña del navegador — pero no los bots de vista previa social, que solo leen el bloque estático de `index.html` de arriba, sin importar la ruta compartida. Resolver eso del todo requeriría SSR/prerender, fuera de alcance mientras el sitio sea 100% estático en Hostinger.
- Si cambia el dominio de producción, actualizar la constante `SITE_URL` en `seo.util.ts` (y las URLs hardcodeadas en `index.html`, `public/robots.txt`, `public/sitemap.xml`).
- Si se agrega una ruta nueva a `app.routes.ts`, hay que tocar 3 lugares: `seo.util.ts` (agregar su entrada a `SEO_KEY_BY_PATH` y su bloque `seo.<key>.{title,description}` en ambos JSON — si no, cae al fallback `'home'`), y `public/sitemap.xml` (agregar su par EN/ES con los 3 `xhtml:link` de hreflang, mismo patrón que las rutas existentes).
- `public/robots.txt` apunta a `public/sitemap.xml` — ambos se copian al build igual que cualquier archivo de `public/` (no requieren configuración adicional en `angular.json`).

### 11. Analytics (Google Analytics 4)
- GA4 (Measurement ID `G-G32X4QK32J`) vive en `src/app/shared/analytics.service.ts`, inyectado una vez desde `app.ts`. **No** hay ninguna etiqueta de gtag.js estática en `index.html` a propósito: ese archivo es idéntico en dev y producción (no pasa por `fileReplacements`), así que una etiqueta estática cargaría también en `ng serve` local. El servicio inyecta el `<script>` de gtag.js en `<head>` en tiempo de ejecución, **solo si `environment.production` es `true`** — verificado en navegador: en build de producción se ve `window.gtag` y `dataLayer` poblados; en build de development, ninguno de los dos existe.
- `send_page_view: false` en el `config` inicial — los `page_view` se disparan a mano en cada `NavigationEnd` del Router (cubre rutas en inglés y `/es/*` por igual, ya que usa `event.urlAfterRedirects` tal cual).
- Si se agrega otro script de analytics/tracking en el futuro, replicar este mismo patrón (inyección condicionada a `environment.production`, nunca estático en `index.html`) y sumar su dominio a la CSP en `.htaccess` (ver regla de seguridad #8).

## Qué NO construir en esta fase

- No agregar backend propio (Node, PHP, APIs) salvo que el usuario lo pida explícitamente.
- No usar `localStorage` / `sessionStorage` para guardar datos sensibles.
- No integrar scripts de terceros, píxeles de tracking o analíticos sin necesidad clara y sin avisar al usuario primero. (GA4 ya se integró a pedido explícito del usuario — ver regla de seguridad #11 — esta regla sigue aplicando para cualquier script *nuevo*.)
- No implementar carrito de compras, pasarela de pagos, ni autenticación de usuarios salvo instrucción explícita.

---

# Brief del proyecto — Epix Code (epixcode.com)

## Objetivo
Sitio web corporativo para **Epix Code**, una empresa enfocada en optimizar procesos de negocio mediante automatización, desarrollo web, e integración de herramientas de inteligencia artificial — con un departamento de marketing que ofrece servicios complementarios de crecimiento digital. Dirigido principalmente a clientes en Estados Unidos, con posibilidad de clientes en Colombia. Sitio bilingüe (inglés/español).

## Stack técnico
- Angular 22 (standalone components), sin SSR
- SCSS propio (`src/styles/_variables.scss` + `src/styles.scss`) — **sin Bootstrap ni ningún framework de CSS.** Se instaló Bootstrap al inicio del proyecto para el grid/utilidades y nunca se usó una sola clase suya en ningún componente (se verificó con grep antes de quitarlo); el grid responsive se resuelve con CSS Grid/Flexbox nativo. No reinstalarlo salvo necesidad real y verificada.
- Angular Router, rutas separadas por sección, con detección de idioma por prefijo de URL (ver "Idioma" abajo)
- Compilación estática (`ng build --configuration production`) → Hostinger
- Formulario de contacto vía Formspree, con honeypot
- ngx-translate para el bilingüe
- Iconos: SVG inline con paths de Lucide copiados a mano, sin librería instalada (ver regla de seguridad #6)
- Elementos interactivos (menú móvil, acordeones, etc.) construidos con el propio estado de Angular (signals) — nunca con JavaScript de un framework de UI, para evitar conflictos con el sistema de detección de cambios de Angular.
- `src/environments/` (`environment.ts` = producción, `environment.development.ts` = `ng serve`/build development, con `fileReplacements` en `angular.json`) — generado con el schematic oficial `ng generate environments`, no a mano. Hoy solo trae `production: boolean`, usado por `analytics.service.ts` para no cargar GA4 en local (ver regla de seguridad #11). Si se necesita otra config por ambiente en el futuro, agregarla ahí en vez de crear un mecanismo nuevo.

## Estructura sugerida (secciones)

### 1. Hero / Portada
- Nombre de la empresa (Epix Code), tagline sobre optimización de procesos + integración de IA, CTA hacia servicios o contacto.

### 2. Sobre nosotros
> Texto de partida (ajustar con la voz definitiva de la marca antes de publicar):
>
> "En Epix Code ayudamos a las empresas a optimizar sus procesos combinando automatización, desarrollo web e inteligencia artificial. Nuestro equipo diseña soluciones a medida que eliminan tareas repetitivas, integran herramientas de IA en el día a día del negocio, y acompañan el crecimiento digital con un enfoque de marketing integral."

### 3. Servicios
**Desarrollo y automatización**
- Desarrollo de sitios y aplicaciones web
- Automatización de procesos internos
- Integración de herramientas de inteligencia artificial

**Marketing**
- Media buying
- Creación de campañas de contenido
- Parrillas de contenido
- Estrategias de marketing
- Consultoría de redes sociales y marketing

### 4. Proyectos / Casos de trabajo
Mostrar ejemplos de trabajo realizado en tono de empresa ("hemos desarrollado", "nuestro equipo construyó"):
- E-commerce desplegado en infraestructura propia (droplet + dominio)
- Herramienta de sincronización automática de métricas publicitarias con integración a gestor de proyectos
- Herramienta de conciliación de facturas con procesamiento automático de XML
- Rediseño de tienda online (WordPress/WooCommerce) para cliente
- Aplicación de gestión de casos con exportación de datos

### 5. Contacto
- Formulario (nombre, correo, mensaje) → llega a la cuenta de Google Workspace.
- Enlaces: redes/GitHub de la empresa (si aplica), LinkedIn, correo directo.
- Aviso breve de privacidad (ver regla de seguridad #7).

## Idioma: bilingüe (ES/EN) — implementado
- Se usa **ngx-translate** (`@ngx-translate/core` + `@ngx-translate/http-loader`), no el `@angular/localize` nativo.
  - Motivo: `@angular/localize` requiere compilar un build separado por idioma — más complejo de desplegar en Hostinger. ngx-translate cambia el idioma en tiempo real dentro de un único build, con archivos JSON (`public/i18n/es.json`, `public/i18n/en.json`).
- **El idioma se determina por la URL, no por `localStorage`.** El español vive bajo el prefijo `/es/*` (ej. `/es/services`); el inglés es la ruta desnuda (ej. `/services`) y es el idioma por defecto. Fuente de verdad única: `src/app/shared/lang-url.util.ts` (`langFromUrl`, `stripLangPrefix`, `withLang`), consumido por `app.config.ts` (idioma inicial), `app.ts` (sincroniza en cada navegación) y el pipe `src/app/shared/lang-link.pipe.ts` (`| langLink`, usado en todo `routerLink` interno).
  - Motivo del cambio de plan original (localStorage): permite que cada campaña de ads (Meta Ads, etc.) apunte a un link fijo por idioma y siempre aterrice en el idioma correcto, sin depender de una preferencia guardada del navegador.
- Selector de idioma (ES/EN) visible en el navbar, en todas las páginas.

## Navegación: rutas separadas por sección (Angular Router)
- `/` — Home / Hero
- `/about` — Sobre nosotros
- `/services` — Servicios (sin hero de imagen, tabs Optimization&AI/Marketing + acordeón de 6 categorías, ver "Página de Servicios" abajo)
- `/how-it-works` — Cómo trabajamos (proceso de 3 pasos + journey + resultados)
- `/contact` — Contacto
- Cada ruta existe también bajo `/es/*` (ver "Idioma" arriba) — no como entradas separadas en `app.routes.ts`, sino como children de una ruta `es` que reutiliza el mismo array de páginas.
- **`/projects` — EN PAUSA.** El componente ya está construido en `src/app/pages/projects/`, pero no está enlazado en el navbar ni en `app.routes.ts`. No borrar el componente ni sus archivos — se reactivará más adelante cuando el usuario lo pida explícitamente.
- Cada sección es un componente standalone independiente.
- `public/.htaccess` ya incluye la regla de reescritura hacia `index.html` para que recargar en `/services` o `/es/services` no dé 404 — resuelto, no pendiente.
- El wildcard (`{ path: '**', redirectTo: '' }`) existe **duplicado, uno por nivel** (raíz y dentro de los children de `es`), en ese orden. Si se edita `app.routes.ts`, cuidado con volver a compartir un único array de wildcard entre ambos niveles: eso hace que el wildcard de raíz capture `/es/lo-que-sea` antes de que Angular intente la ruta `es`, y una URL rota en español termina redirigiendo a inglés — justo el bug que se corrigió.

## Identidad visual

### Colores de marca (obligatorio usar estos, no la paleta genérica azul/morado por defecto)
- **Crema** `#FAF7F2` — fondo principal / espacios en blanco
- **Negro** `#161A1D` — texto principal, contraste fuerte
- **Verde oliva** `#616C44` — color de acento (botones, links, detalles, CTA)

Si se necesitan más colores (estados hover, fondos secundarios, sombras, etc.), deben derivarse de esta paleta — variaciones más claras/oscuras del verde oliva, o grises cálidos cercanos al negro/crema. No introducir colores ajenos a esta gama (nada de azules, morados o colores saturados que no combinen con esta identidad tierra/oliva).

Definir estos tres colores como variables SCSS (`$color-crema`, `$color-negro`, `$color-oliva`) en un archivo central de estilos (ej. `_variables.scss`) para reutilizarlos en todo el proyecto de forma consistente.

### Logo
- Assets de marca en `public/`: `logo-icon.png` (isotipo, usado como favicon) y `logofondonegro.png` (logo completo sobre fondo negro, usado en navbar/footer sobre fondo oscuro y como imagen de Open Graph). `logo-icon-transparent.png` se quitó del repo por no usarse en ningún componente (verificado con grep antes de borrarlo).
- Basar cualquier elemento visual adicional (iconografía, estilo de las imágenes generadas con IA del punto 9 de seguridad) en el estilo y los colores del logo, para mantener consistencia de marca.

### Imágenes de fondo por sección (no placeholders — ya son las reales)
- `FondoHero.jpg` — hero de Home.
- `Fondohiw1.jpg` — hero de Cómo trabajamos. (`Fondohiw2.png` se quitó del repo: se preparó para una segunda franja de esa página que nunca se usó en el código — verificado con grep antes de borrarlo.)
- `FondoCta.jpg` — banner de CTA final ("Ready to work smarter?"), compartido entre Home y Servicios (ver "Banner de CTA compartido" abajo). El archivo de diseño original traía dos fotos de personas superpuestas — se pidió explícitamente no usarlas; el fondo que se integró es solo la textura/onda oliva, sin fotos.
- Servicios (`/services`) **no tiene imagen de fondo** — se le quitó el hero por completo (ver "Página de Servicios" abajo); `FondoHeroServices.png` se quitó del repo por quedar sin usar.
- Las 3 son **JPEG**, no PNG (se convirtieron en la auditoría de performance: son opacas, sin canal alpha, y JPEG pesa ~90% menos para este tipo de imagen — ver regla de seguridad #9). Si se agrega una imagen de fondo nueva para otra página, seguir la convención de nombre `Fondo<Sección>.jpg` en `public/` (mayúscula inicial, sin espacios) — y solo usar `.png` si la imagen necesita transparencia.
- **Ojo con el case del nombre de archivo:** macOS (donde se desarrolla) no distingue mayúsculas/minúsculas en el filesystem, pero git sí las registra tal cual, y Hostinger corre Linux (sí distingue). Ya se corrigió un caso real donde git tenía `Fondocta.png`/`fondoheroservices.png` en su índice mientras el archivo en disco (y las referencias en el código, `url('/FondoCta.png')`) usaban otro case — invisible en local, hubiera roto la imagen en producción. Si se renombra solo el case de un archivo (`git mv viejo.png Viejo.png`), confirmar después con `git ls-files public/` que el case coincide exactamente con el que usa el código.

## Decisiones ya resueltas (quedan aquí como referencia, no reabrir sin pedido explícito)
- [x] Paleta de colores — crema/negro/oliva (ver "Identidad visual" arriba).
- [x] Tipografía — **Poppins** (pesos 400–800, cargada vía Google Fonts en `index.html`), jerarquía por peso/tamaño, no por familias distintas.
- [x] Nombre de marca definitivo — **Epix Code**, wordmark "epix**code**" (oliva en la segunda mitad) en navbar/footer.
- [x] Textos de "Sobre nosotros" y "Servicios" — reescritos y finalizados en `public/i18n/es.json` / `en.json`; el texto de partida de este documento (sección 2/3 arriba) es histórico, no la copia real del sitio.
- [x] Icono del sitio — Lucide (paths copiados a mano, ver regla de seguridad #6), reemplazando los SVG dibujados a mano de la primera versión.
- [x] Banner de CTA ("Ready to work smarter? / Let's optimize your processes.") — **sí va**, al final de Home y de Servicios (y candidato a agregarse a más páginas), tarjeta completa como link a `https://calendly.com/epixcode/freediagnosticcall`. Hubo una instrucción explícita anterior de NO agregarlo que luego se revirtió; tratar esta versión como la definitiva salvo nueva instrucción.
- [x] Página de Servicios — rediseñada por completo (ya no es el layout viejo de filas imagen/texto alternadas, y ya tampoco tiene el hero de imagen que tuvo en una iteración intermedia — se quitó a pedido explícito, junto con `FondoHeroServices.png`). Ahora es una intro de texto + tabs (Optimization & AI / Marketing) + tarjetas tipo acordeón por tab. Ver "Página de Servicios (acordeón)" abajo para el detalle de implementación.

## Banner de CTA compartido (Home + Servicios)
El banner verde de cierre vive en dos páginas con el mismo contenido, mismo link de Calendly y mismo fondo (`FondoCta.jpg`), así que su copy se movió a una clave de traducción compartida en vez de duplicarse por página:
- Claves i18n: `common.cta.title` / `titleAccent` / `button` / `response` (antes vivían bajo `home.cta.*`; si se busca contenido viejo con ese prefijo, ya no existe).
- Markup y estilos SÍ están duplicados a propósito en cada página (`.home-cta*` en `home.scss`, `.services-cta*` en `services.scss`) — mismo patrón, prefijo de clase distinto por página. Si se agrega a una tercera página, replicar el mismo patrón (no crear un componente compartido salvo que se repita en 4+ lugares).
- Toda la tarjeta es un único `<a>` externo a Calendly — el botón visual interno tiene `pointer-events: none`.
- **Contacto NO usa este banner** — se probó (ver commit revertido) y el usuario prefirió, en su lugar, un botón simple `btn btn--primary` a Calendly justo debajo del texto de tiempo de respuesta (`contact.direct.response`), dentro de `.contact-hero__intro`. Clave i18n: `contact.direct.calendlyButton`. No reintroducir el banner ahí sin que se pida explícitamente.

## Página de Servicios (tabs + acordeón)
- Componente: `src/app/pages/services/services.ts`. Sin hero de imagen — la página arranca directo con `.services-intro` (texto centrado) y no está en `HERO_PAGE_PATHS` de `navbar.ts`, así que el navbar es sticky normal ahí, no flotante transparente.
- 6 categorías en total, repartidas en 2 tabs con un signal `activeTab = signal<ServicesTab>('automation')` / `setTab(tab)`: índices 0–3 bajo "Optimization & AI" (Process Evaluation, Process Optimization, Automation & AI, Business Consulting), índices 4–5 bajo "Marketing" (Web Design & Development, Marketing) — el desarrollo web vive bajo el tab de Marketing, no el de Optimization & AI.
- Estado de apertura/cierre por tarjeta con un signal `openCategories = signal<ReadonlySet<number>>(new Set())` — **arrancan todas cerradas** (no abiertas como en una iteración anterior) y los métodos `isOpen(i)` / `toggle(i)` alternan cada tarjeta de forma independiente, no es un acordeón exclusivo de "una sola abierta a la vez" — nada de librerías de acordeón ni JS de terceros (ver regla de seguridad #6).
- Cada cabecera de categoría es un `<button>` (no un `<div>` con click) por accesibilidad — título y descripción van en `<span>` (no `<h3>`/`<p>`) porque esos bloques no son contenido válido dentro de un `<button>`; el apilado vertical se logra con `display:flex; flex-direction:column` en el contenedor, no con los elementos en sí.
- El colapsable usa el truco de `grid-template-rows: 0fr → 1fr` con transición (no `max-height`), porque anima a la altura real del contenido sin tener que calcularla en JS. Requiere un wrapper con `overflow:hidden; min-height:0` adentro.
- El grid de sub-ítems usa `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`, no un número fijo de columnas — así categorías con distinta cantidad de ítems se acomodan solas sin dejar hueco.

## Reset global (`styles.scss`)
El navegador pone ~8px de margin por defecto al `<body>`; sin resetearlo se veía como un borde alrededor de todo el sitio (bug real, ya corregido). `styles.scss` ya tiene `* { box-sizing: border-box; } html, body { margin: 0; padding: 0; }` al principio — no quitarlo.

## Menú móvil sobre hero oscuro (bug conocido, ya corregido)
En páginas con `.site-header--hero` (ver `HERO_PAGE_PATHS` en `navbar.ts`), si el usuario abre el menú hamburguesa **antes** de hacer scroll, el header sigue en su estado `--transparent` y el contenido del hero se transparentaba detrás de los links del menú, ilegible. Se corrigió con una clase adicional `[class.site-header--menu-open]="isMenuOpen()"` en `navbar.html` + una regla en `navbar.scss` (`&--transparent.site-header--menu-open`) que fuerza un fondo oscuro casi opaco solo mientras el menú está abierto en ese estado. **Si se agrega una página nueva a `HERO_PAGE_PATHS`, probar el menú móvil sin haber hecho scroll** — este bug se repite ahí si algo lo rompe.

## Navbar: selector de idioma fuera del menú colapsable, y layout desktop por `order`
El selector ES/EN (`.navbar__lang`) vive en `navbar.html` en un bloque `.navbar__tools` **fuera** de `<nav class="navbar__menu">`, como hermano justo antes del `<nav>` en el DOM — antes vivía dentro de `.navbar__actions`, adentro del menú, y en móvil quedaba invisible hasta abrir el hamburguesa (se corrigió a pedido del usuario). No se puede resolver solo con CSS: un ancestro con `display:none` (`.navbar__menu` cerrado) saca a **todo** su subárbol del render, sin excepción posible por un descendiente — por eso el selector tiene que ser un elemento aparte, no un hijo reposicionado.
- **Orden en el DOM importa en móvil**: `.navbar__tools` (idioma + hamburguesa) va ANTES del `<nav>` en el HTML, no después. `.navbar__inner` es `flex-wrap` en móvil; `.navbar__menu` tiene `flex-basis:100%`, así que fuerza su propio salto de línea en cuanto aparece — si `.navbar__tools` viniera después del `<nav>` en el DOM, el menú (100% de ancho) lo empujaría a una tercera línea en vez de quedar junto al logo en la primera.
- **Desktop (≥900px) ya no usa el truco de grid `1fr auto 1fr`** (columnas iguales para centrar los links) porque ahora hay 2 grupos independientes al lado derecho (idioma y CTA) que no pueden compartir una sola columna de grid sin superponerse. Se cambió a flexbox: `.navbar__menu` y `.navbar__tools` pasan a `display:contents` (igual que antes, para que sus hijos sean ítems directos del flex de `.navbar__inner`), y el orden visual real lo define `order` explícito en cada uno (`.navbar__links` order 1 + `margin: 0 auto` para centrarse en el espacio libre, `.navbar__lang` order 2, `.navbar__actions` order 3) — el orden en el DOM ya no determina el orden visual en desktop, solo en móvil.
- El centrado de `.navbar__links` con `margin:0 auto` no es matemáticamente idéntico al truco de grid viejo cuando el logo y el grupo idioma+CTA difieren mucho en ancho (puede quedar unos px descentrado) — visualmente no se nota a este tamaño, pero si se agrega/quita algo grande de cualquiera de los dos lados, confirmar en navegador.
- `.navbar__toggle` (el botón hamburguesa) necesita `color: inherit` explícito — un `<button>` sin `color` propio no hereda el color del header vía CSS normal, cae al estilo nativo del navegador (en iOS Safari, un azul de sistema) y `.navbar__toggle-bar { background: currentColor }` terminaba pintando las líneas de ese azul en vez del negro/crema del sitio. Si se agrega otro botón custom-styled al navbar, aplicar el mismo `color: inherit` (y `appearance: none`) desde el principio.

## Cómo probar el sitio en mobile en esta sesión de trabajo
Las herramientas de navegador de este entorno (`resize_window`) no siempre cambian el `viewport` real de la pestaña (se vio `window.innerWidth` quedarse en el ancho de escritorio pese a "redimensionar" con éxito). Workaround que sí funciona: cargar la página real dentro de un `<iframe>` con `style.width` fijo (ej. `390px`) inyectado por JS en la pestaña — un iframe sí dispara los media queries CSS al ancho real que se le da, sin depender del tamaño de la ventana del navegador.

## Notas de proceso (cómo se ha trabajado en este proyecto)
- **No inventar datos de negocio no confirmados** (teléfono, dirección, horarios, cifras, testimonios). Si un mockup los sugiere pero Epix Code no los ha dado, omitirlos — no rellenar con algo "razonable".
- **Verificar siempre con build + navegador antes de dar algo por terminado**: `ng build --configuration production` sin errores, y revisión visual en `ng serve` (incluyendo ambos idiomas y el ancho mobile — ver "Cómo probar el sitio en mobile" arriba — cuando aplique), no solo que compile.
- **Al corregir un patrón puntual (ej. una tarjeta sin `prefers-reduced-motion`), revisar todo el proyecto por el mismo patrón**, no solo el caso señalado.
- **Para datos externos exactos (paths SVG, etc.), usar `curl`, no WebFetch** — WebFetch resume el contenido con un modelo intermedio y puede alterar valores numéricos precisos.
