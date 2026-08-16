import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
