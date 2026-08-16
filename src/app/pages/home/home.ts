import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { ImagePlaceholder } from '../../shared/image-placeholder/image-placeholder';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, ScrollRevealDirective, ImagePlaceholder],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
