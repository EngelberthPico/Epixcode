import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LangLinkPipe } from '../lang-link.pipe';
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL } from '../social-links.constants';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, LangLinkPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly instagramUrl = INSTAGRAM_URL;
  protected readonly facebookUrl = FACEBOOK_URL;
  protected readonly whatsappUrl = WHATSAPP_URL;
  protected readonly currentYear = new Date().getFullYear();
}
