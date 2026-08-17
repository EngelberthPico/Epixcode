import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Services } from './pages/services/services';
import { Contact } from './pages/contact/contact';
import { HowItWorks } from './pages/how-it-works/how-it-works';

// La ruta /projects está en pausa (ver CLAUDE.md). El componente sigue en
// src/app/pages/projects/ listo para reconectarse cuando se reactive.
const pageRoutes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'services', component: Services },
  { path: 'how-it-works', component: HowItWorks },
  { path: 'contact', component: Contact },
];

// Español bajo /es/* (ej. /es/services), inglés en la ruta desnuda — así
// cada campaña de ads puede apuntar a un link distinto por idioma. Ver
// shared/lang-url.util.ts, que es la única fuente de verdad de este
// prefijo (el idioma activo lo determina la URL, no localStorage).
//
// Cada nivel tiene su propio wildcard, y el de nivel superior va DESPUÉS
// de 'es': un redirectTo relativo se resuelve contra el punto del árbol
// donde está definido, así que /es/lo-que-sea-roto cae en /es (español) en
// vez de saltar a / (inglés) — pero solo si Angular llega a intentar la
// ruta 'es' antes que el wildcard raíz. Si el wildcard raíz fuera el
// primero (o si ambos niveles compartieran el mismo array con el wildcard
// incluido), atraparía /es/* también y rompería el idioma en cualquier 404.
export const routes: Routes = [
  ...pageRoutes,
  { path: 'es', children: [...pageRoutes, { path: '**', redirectTo: '' }] },
  { path: '**', redirectTo: '' },
];
