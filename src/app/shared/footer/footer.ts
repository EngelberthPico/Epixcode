import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { FACEBOOK_URL, INSTAGRAM_URL } from '../social-links.constants';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly instagramUrl = INSTAGRAM_URL;
  protected readonly facebookUrl = FACEBOOK_URL;
  protected readonly currentYear = new Date().getFullYear();
}
