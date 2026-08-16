import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';
import { langFromUrl } from './shared/lang-url.util';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, WhatsappButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  constructor() {
    // La URL es la única fuente de verdad del idioma (ver
    // shared/lang-url.util.ts): /es/* siempre muestra español, el resto
    // siempre inglés, sin depender de una preferencia guardada. Esto es
    // clave para que los links de campañas de ads aterricen siempre en el
    // idioma correcto.
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const lang = langFromUrl(event.urlAfterRedirects);
        if (this.translate.currentLang() !== lang) {
          this.translate.use(lang);
        }
        document.documentElement.lang = lang;
      });
  }
}
