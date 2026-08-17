import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

export type ServicesTab = 'automation' | 'marketing';

@Component({
  selector: 'app-services',
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  // Las 6 categorías empiezan cerradas; el usuario debe abrir cada una para
  // ver su contenido. Cada clic alterna solo esa tarjeta, no es un acordeón
  // exclusivo de "una sola abierta a la vez". Índices 0-3: tab "automation"
  // (Process Evaluation, Process Optimization, Automation & AI, Business
  // Consulting). Índices 4-5: tab "marketing" (Web Design & Development,
  // Marketing).
  protected readonly openCategories = signal<ReadonlySet<number>>(new Set());

  protected readonly activeTab = signal<ServicesTab>('automation');

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

  protected setTab(tab: ServicesTab): void {
    this.activeTab.set(tab);
  }
}
