import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { LangLinkPipe } from '../../shared/lang-link.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe, ScrollRevealDirective, LangLinkPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
