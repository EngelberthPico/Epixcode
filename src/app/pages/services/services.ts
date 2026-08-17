import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-services',
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  // Las 5 categorías empiezan abiertas (ver mockup); cada clic alterna solo
  // esa tarjeta, no es un acordeón exclusivo de "una sola abierta a la vez".
  protected readonly openCategories = signal<ReadonlySet<number>>(new Set([0, 1, 2, 3, 4]));

  protected isOpen(index: number): boolean {
    return this.openCategories().has(index);
  }

  protected toggle(index: number): void {
    this.openCategories.update((open) => {
      const next = new Set(open);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }
}
