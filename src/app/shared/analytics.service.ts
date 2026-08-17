import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { environment } from '../../environments/environment';

const GA_MEASUREMENT_ID = 'G-G32X4QK32J';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Carga gtag.js e inicializa GA4 solo cuando environment.production es true,
// para no ensuciar las estadísticas con pruebas locales de `ng serve`. Por
// eso el script no está hardcodeado en index.html (el mismo archivo se usa
// en dev y producción, sin fileReplacements) — se inyecta en <head> desde
// acá. send_page_view:false en el config inicial porque los page_view se
// disparan a mano en cada NavigationEnd (rutas en inglés y /es/* por igual,
// ya que urlAfterRedirects ya trae el prefijo tal cual).
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!environment.production) return;

    this.loadGtag();
    this.trackPageViews();
  }

  private loadGtag(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        window.gtag?.('event', 'page_view', {
          page_path: event.urlAfterRedirects,
          page_location: window.location.href,
        });
      });
  }
}
