import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SupportedLang } from './i18n.constants';
import { withLang } from './lang-url.util';

// Convierte una ruta "desnuda" (ej. "/services") en la URL con el prefijo
// del idioma activo (ej. "/es/services" en español). Impuro a propósito:
// currentLang() es una señal, y el pipe debe recalcular el link apenas
// cambie el idioma, no solo cuando cambie la referencia del string de
// entrada.
@Pipe({ name: 'langLink', pure: false })
export class LangLinkPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(path: string): string {
    return withLang(path, this.translate.currentLang() as SupportedLang);
  }
}
