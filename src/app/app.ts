import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, WhatsappButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
