import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { ImagePlaceholder } from '../../shared/image-placeholder/image-placeholder';

@Component({
  selector: 'app-services',
  imports: [RouterLink, TranslatePipe, ScrollRevealDirective, ImagePlaceholder],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {}
