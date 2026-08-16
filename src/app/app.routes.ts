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
export const routes: Routes = [
  ...pageRoutes,
  { path: 'es', children: pageRoutes },
  { path: '**', redirectTo: '' },
];
