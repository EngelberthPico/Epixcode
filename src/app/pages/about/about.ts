import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { ImagePlaceholder } from '../../shared/image-placeholder/image-placeholder';

@Component({
  selector: 'app-about',
  imports: [RouterLink, TranslatePipe, ScrollRevealDirective, ImagePlaceholder],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
