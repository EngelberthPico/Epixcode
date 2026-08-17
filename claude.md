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

### 8. Cabeceras de seguridad (si se genera `.htaccess`)
```
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

### 9. Imágenes generadas con IA
- El sitio usará imágenes generadas con IA para su identidad visual.
- **Dejar la generación de imágenes reales para el final del proyecto**, para no agotar límites de uso/tokens a mitad de la construcción del resto del sitio.
- Mientras se construye la estructura y el contenido, usar imágenes de marcador de posición (por ejemplo, bloques de color sólido o un servicio como `https://placehold.co/`).
- Al final, generar las imágenes reales y reemplazar los placeholders uno por uno.

### 10. SEO básico (index.html + rutas)
- `src/index.html` trae `meta description`, Open Graph y Twitter Card estáticos — es lo único que ven los bots que no ejecutan JavaScript (vistas previas de WhatsApp/Slack/redes al compartir un link), así que si cambia el copy principal del Home o el dominio, hay que actualizarlos ahí también.
- `src/app/shared/seo.util.ts` sincroniza `canonical` y `hreflang` (`en`/`es`/`x-default`) en cada navegación, para que Google entienda que cada página y su par en el otro idioma (ej. `/services` y `/es/services`) son la misma página en dos idiomas, no contenido duplicado. Si cambia el dominio de producción, actualizar la constante `SITE_URL` ahí (y las URLs hardcodeadas en `index.html`).
- Si se agrega una ruta nueva, no hace falta tocar `seo.util.ts` — deriva la URL de la ruta actual automáticamente.

## Qué NO construir en esta fase

- No agregar backend propio (Node, PHP, APIs) salvo que el usuario lo pida explícitamente.
- No usar `localStorage` / `sessionStorage` para guardar datos sensibles.
- No integrar scripts de terceros, píxeles de tracking o analíticos sin necesidad clara y sin avisar al usuario primero.
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
- `/services` — Servicios
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
- Assets de marca en `public/`: `logo-icon.png` / `logo-icon-transparent.png` (isotipo, usado como favicon) y `logofondonegro.png` (logo completo sobre fondo negro, usado en navbar/footer sobre fondo oscuro y como imagen de Open Graph).
- Basar cualquier elemento visual adicional (iconografía, estilo de las imágenes generadas con IA del punto 9 de seguridad) en el estilo y los colores del logo, para mantener consistencia de marca.

## Decisiones ya resueltas (quedan aquí como referencia, no reabrir sin pedido explícito)
- [x] Paleta de colores — crema/negro/oliva (ver "Identidad visual" arriba).
- [x] Tipografía — **Poppins** (pesos 400–800, cargada vía Google Fonts en `index.html`), jerarquía por peso/tamaño, no por familias distintas.
- [x] Nombre de marca definitivo — **Epix Code**, wordmark "epix**code**" (oliva en la segunda mitad) en navbar/footer.
- [x] Textos de "Sobre nosotros" y "Servicios" — reescritos y finalizados en `public/i18n/es.json` / `en.json`; el texto de partida de este documento (sección 2/3 arriba) es histórico, no la copia real del sitio.
- [x] Icono del sitio — Lucide (paths copiados a mano, ver regla de seguridad #6), reemplazando los SVG dibujados a mano de la primera versión.
- [x] Banner de CTA en Home ("Ready to work smarter? / Let's optimize your processes.") — **sí va**, al final de Home antes del footer, tarjeta completa como link a `https://calendly.com/epixcode/freediagnosticcall`. Hubo una instrucción explícita anterior de NO agregarlo que luego se revirtió; tratar esta versión como la definitiva salvo nueva instrucción.

## Notas de proceso (cómo se ha trabajado en este proyecto)
- **No inventar datos de negocio no confirmados** (teléfono, dirección, horarios, cifras, testimonios). Si un mockup los sugiere pero Epix Code no los ha dado, omitirlos — no rellenar con algo "razonable".
- **Verificar siempre con build + navegador antes de dar algo por terminado**: `ng build --configuration production` sin errores, y revisión visual en `ng serve` (incluyendo ambos idiomas cuando aplique), no solo que compile.
- **Al corregir un patrón puntual (ej. una tarjeta sin `prefers-reduced-motion`), revisar todo el proyecto por el mismo patrón**, no solo el caso señalado.
- **Para datos externos exactos (paths SVG, etc.), usar `curl`, no WebFetch** — WebFetch resume el contenido con un modelo intermedio y puede alterar valores numéricos precisos.
