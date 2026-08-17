import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';
import { AnalyticsService } from './shared/analytics.service';
import { langFromUrl } from './shared/lang-url.util';
import { seoKeyForPath, syncSeoTags } from './shared/seo.util';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, WhatsappButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  // Solo instanciarlo ya activa su tracking de page_view (ver
  // shared/analytics.service.ts) — no hace falta llamar ningún método.
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    // La URL es la única fuente de verdad del idioma (ver
    // shared/lang-url.util.ts): /es/* siempre muestra español, el resto
    // siempre inglés, sin depender de una preferencia guardada. Esto es
    // clave para que los links de campañas de ads aterricen siempre en el
    // idioma correcto.
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        const lang = langFromUrl(url);
        if (this.translate.currentLang() !== lang) {
          this.translate.use(lang);
        }
        document.documentElement.lang = lang;

        // Se pide la traducción explícitamente en `lang` (en vez de
        // depender de currentLang()/instant()) porque get() espera a que
        // el loader HTTP resuelva ese idioma, incluso en la primera
        // navegación antes de que el JSON haya llegado.
        const seoKey = seoKeyForPath(url);
        this.translate.get([`seo.${seoKey}.title`, `seo.${seoKey}.description`], undefined, lang).subscribe((t) => {
          syncSeoTags(url, {
            title: t[`seo.${seoKey}.title`],
            description: t[`seo.${seoKey}.description`],
          });
        });
      });
  }
}
