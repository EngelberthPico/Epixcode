import { Component, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs';

import { LANG_STORAGE_KEY, SUPPORTED_LANGS, SupportedLang } from '../i18n.constants';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);
  protected readonly currentLang = this.translate.currentLang;
  protected readonly languages = SUPPORTED_LANGS;

  // El hero de Home es oscuro: solo ahí el navbar arranca transparente/flotante
  // (ver spec de diseño). En el resto de páginas el fondo es siempre sólido.
  protected readonly isHome = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects === '/'),
    ),
    { initialValue: this.router.url === '/' },
  );

  protected readonly scrolled = signal(typeof window !== 'undefined' && window.scrollY > 30);

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 30);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected setLang(lang: SupportedLang): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}
