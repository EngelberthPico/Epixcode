import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { LangLinkPipe } from '../../shared/lang-link.pipe';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink, TranslatePipe, ScrollRevealDirective, LangLinkPipe],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {}
