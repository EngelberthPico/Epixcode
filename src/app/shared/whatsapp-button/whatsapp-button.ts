import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { WHATSAPP_URL } from '../social-links.constants';

@Component({
  selector: 'app-whatsapp-button',
  imports: [TranslatePipe],
  templateUrl: './whatsapp-button.html',
  styleUrl: './whatsapp-button.scss',
})
export class WhatsappButton {
  protected readonly whatsappUrl = WHATSAPP_URL;
}
